package com.tencent.hr.recruit.bole.openapi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * /interviewer/h5-data 接口真实集成测试
 * <p>
 * 执行前请确保：
 * 1. 服务已部署且通过系统属性/环境变量提供 baseUrl 与 token（见 TestConfig）。
 * 2. Redis 已清空，interviewer_id=10001 数据存在，99999 不存在。
 * 3. 测试仅调用 GET 接口，无需数据清理。
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class InterviewerH5DataIntegrationTest {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private static final TestConfig CONFIG = TestConfig.load();

    @BeforeAll
    static void beforeAll() {
        assertFalse(CONFIG.baseUrl.isBlank(), "请通过 -Dopenapi.base-url 或 OPEN_API_BASE_URL 配置接口地址");
    }

    @Test
    @Order(1)
    @DisplayName("H5-001 有效面试官返回 200 且数据完整")
    void shouldReturnDataForValidInterviewer() throws Exception {
        HttpResponse<String> response = sendGet(Map.of("interviewerId", TestData.INTERVIEWER_ID_EXISTS));

        assertEquals(200, response.statusCode(), "应返回 200");
        JsonNode body = OBJECT_MAPPER.readTree(response.body());
        assertTrue(body.path("success").asBoolean(), "success 应为 true");
        JsonNode data = body.path("data");
        assertEquals(Long.parseLong(TestData.INTERVIEWER_ID_EXISTS), data.path("employeeId").asLong());
        assertTrue(data.path("topLikeReasons").isArray(), "topLikeReasons 应为数组");
        assertTrue(data.path("companyTotalInterviewers").asInt() > 0, "集团面试官数量应大于 0");
    }

    @Test
    @Order(2)
    @DisplayName("H5-002 二次请求命中缓存，耗时降低")
    void shouldHitCacheOnSecondCall() throws Exception {
        long first = measureCall();
        long second = measureCall();
        assertTrue(second <= first, String.format(Locale.ROOT,
                "二次请求耗时应不大于首次, first=%dms, second=%dms", first, second));
    }

    @Test
    @Order(3)
    @DisplayName("H5-003 缺少 interviewerId 返回 4xx")
    void shouldRejectMissingParam() throws Exception {
        HttpResponse<String> response = sendRawGet("", Map.of());
        assertTrue(isClientError(response.statusCode()));
        assertTrue(response.body().contains("interviewerId"));
    }

    @Test
    @Order(4)
    @DisplayName("H5-004 interviewerId 为 0 返回 400")
    void shouldRejectNonPositiveId() throws Exception {
        HttpResponse<String> response = sendGet(Map.of("interviewerId", "0"));
        assertEquals(400, response.statusCode());
        assertTrue(response.body().contains("必须大于0"));
    }

    @Test
    @Order(5)
    @DisplayName("H5-005 面试官不存在返回业务错误")
    void shouldReturnErrorWhenInterviewerMissing() throws Exception {
        HttpResponse<String> response = sendGet(Map.of("interviewerId", TestData.INTERVIEWER_ID_NOT_EXISTS));
        assertTrue(isClientError(response.statusCode()));
        assertTrue(response.body().contains("面试官数据不存在"));
    }

    @Test
    @Order(6)
    @DisplayName("H5-006 注入参数被拒绝")
    void shouldRejectInjectionPayload() throws Exception {
        HttpResponse<String> response = sendGet(Map.of("interviewerId", TestData.INTERVIEWER_ID_INJECTION));
        assertTrue(isClientError(response.statusCode()));
    }

    // helpers -----------------------------------------------------------------

    private static HttpResponse<String> sendGet(Map<String, String> query) throws Exception {
        return sendRawGet("/interviewer/h5-data", query);
    }

    private static HttpResponse<String> sendRawGet(String path, Map<String, String> query) throws Exception {
        String finalUrl = CONFIG.baseUrl + path + buildQueryString(query);
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(finalUrl))
                .timeout(Duration.ofSeconds(10))
                .header("Accept", "application/json")
                .GET();
        CONFIG.token.ifPresent(token -> builder.header(CONFIG.tokenHeader, token));
        return HTTP_CLIENT.send(builder.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
    }

    private static long measureCall() throws Exception {
        Instant start = Instant.now();
        HttpResponse<String> response = sendGet(Map.of("interviewerId", TestData.INTERVIEWER_ID_EXISTS));
        assertEquals(200, response.statusCode());
        return Duration.between(start, Instant.now()).toMillis();
    }

    private static String buildQueryString(Map<String, String> query) {
        if (query == null || query.isEmpty()) {
            return "";
        }
        StringBuilder sb = new StringBuilder("?");
        query.forEach((k, v) -> {
            if (sb.length() > 1) {
                sb.append('&');
            }
            sb.append(URLEncoder.encode(k, StandardCharsets.UTF_8));
            sb.append('=');
            sb.append(URLEncoder.encode(v, StandardCharsets.UTF_8));
        });
        return sb.toString();
    }

    private static boolean isClientError(int statusCode) {
        return statusCode >= 400 && statusCode < 500;
    }

    // config & test data -------------------------------------------------------

    private static final class TestConfig {
        private final String baseUrl;
        private final Optional<String> token;
        private final String tokenHeader;

        private TestConfig(String baseUrl, String token, String tokenHeader) {
            this.baseUrl = baseUrl.endsWith("/api/open-api") ? baseUrl : baseUrl + "/api/open-api";
            this.token = Optional.ofNullable(token).filter(s -> !s.isBlank());
            this.tokenHeader = tokenHeader;
        }

        private static TestConfig load() {
            String baseUrl = Optional.ofNullable(System.getProperty("openapi.base-url"))
                    .orElseGet(() -> System.getenv("OPEN_API_BASE_URL"));
            if (baseUrl == null || baseUrl.isBlank()) {
                baseUrl = "http://localhost:8080/api/open-api";
            }
            String token = Optional.ofNullable(System.getProperty("openapi.token"))
                    .orElseGet(() -> System.getenv("OPEN_API_TOKEN"));
            String header = Optional.ofNullable(System.getProperty("openapi.token-header"))
                    .orElseGet(() -> System.getenv().getOrDefault("OPEN_API_TOKEN_HEADER", "X-Bole-Token"));
            return new TestConfig(baseUrl, token, header);
        }
    }

    private static final class TestData {
        private static final String INTERVIEWER_ID_EXISTS = System.getProperty("test.interviewer.id", "10001");
        private static final String INTERVIEWER_ID_NOT_EXISTS = System.getProperty("test.interviewer.id.not-exists", "99999");
        private static final String INTERVIEWER_ID_INJECTION = "' OR '1'='1";
    }
}
