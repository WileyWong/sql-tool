package com.tencent.hr.recruit.bole.business.controller.open;

import com.tencent.hr.recruit.bole.business.response.open.InterviewerH5DataResponse;
import com.tencent.hr.recruit.bole.business.service.InterviewerH5DataService;
import com.tencent.hr.recruit.center.framework.core.Result;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * OpenApiController 单元测试类
 * 测试 getInterviewerH5Data 接口
 *
 * @author AI Assistant
 * @date 2025/12/08
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("OpenApiController - 面试官H5数据接口测试")
class OpenApiControllerTest {

    @Mock
    private InterviewerH5DataService interviewerH5DataService;

    @InjectMocks
    private OpenApiController openApiController;

    private InterviewerH5DataResponse mockResponse;

    @BeforeEach
    void setUp() {
        // Arrange - 准备测试数据
        mockResponse = new InterviewerH5DataResponse();
        mockResponse.setEmployeeId(12L);
        mockResponse.setEmployeeNameCn("卢山");
        mockResponse.setEmployeeNameEn("ls");
        mockResponse.setFirstInterviewDate("2007-09-08");
        mockResponse.setTotalInterviewCount(54);
        mockResponse.setTotalInterviewDuration(2430);
        mockResponse.setMaxDailyInterviews(2);
        mockResponse.setHiredCount(2);
        mockResponse.setLongestTenureYears(new BigDecimal("11.22"));
        mockResponse.setInterviewCount2025(0);
        mockResponse.setLikeCount2025(0);
        mockResponse.setTopLikeReasons(Arrays.asList(
                "面试官有很强的个人专业魅力,让我更期待与之共事",
                "面试官详细介绍了岗位和业务,让我更期待加入腾讯"
        ));
        mockResponse.setCompanyTotalInterviewers(15854);
        mockResponse.setCompanyTotalInterviewDuration(13904100);
        mockResponse.setCompanyTotalCommentWords(36217284L);
    }

    @Test
    @DisplayName("正常场景 - 成功获取面试官H5数据")
    void shouldReturnInterviewerH5DataWhenValidInterviewerId() {
        // Arrange
        Long interviewerId = 12L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        assertNotNull(result.getData(), "返回数据不应为空");

        InterviewerH5DataResponse data = result.getData();
        // 验证面试官基本信息
        assertEquals(12L, data.getEmployeeId().longValue(), "员工ID应该匹配");
        assertEquals("卢山", data.getEmployeeNameCn(), "员工中文名应该匹配");
        assertEquals("ls", data.getEmployeeNameEn(), "员工英文名应该匹配");

        // 验证个人全历史维度统计
        assertEquals("2007-09-08", data.getFirstInterviewDate(), "成为面试官日期应该匹配");
        assertEquals(54, data.getTotalInterviewCount().intValue(), "总面试场次应该匹配");
        assertEquals(2430, data.getTotalInterviewDuration().intValue(), "总面试时长应该匹配");
        assertEquals(2, data.getMaxDailyInterviews().intValue(), "单日最大面试量应该匹配");
        assertEquals(2, data.getHiredCount().intValue(), "总入职人数应该匹配");
        assertEquals(new BigDecimal("11.22"), data.getLongestTenureYears(), "入职人最长在职年限应该匹配");

        // 验证2025个人维度统计
        assertEquals(0, data.getInterviewCount2025().intValue(), "2025年面试场次应该匹配");
        assertEquals(0, data.getLikeCount2025().intValue(), "2025年总被点赞量应该匹配");
        assertNotNull(data.getTopLikeReasons(), "候选人高频正向评价词条不应为空");
        assertEquals(2, data.getTopLikeReasons().size(), "应该返回top2评价词条");

        // 验证2025全公司维度统计
        assertEquals(15854, data.getCompanyTotalInterviewers().intValue(), "集团面试官人数应该匹配");
        assertEquals(13904100, data.getCompanyTotalInterviewDuration().intValue(), "集团面试时长应该匹配");
        assertEquals(36217284L, data.getCompanyTotalCommentWords().longValue(), "集团面评总字数应该匹配");

        // 验证Service方法被调用一次
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("正常场景 - 获取有2025年数据的面试官信息")
    void shouldReturnInterviewerH5DataWith2025Statistics() {
        // Arrange
        Long interviewerId = 47L;
        InterviewerH5DataResponse response2025 = new InterviewerH5DataResponse();
        response2025.setEmployeeId(47L);
        response2025.setEmployeeNameCn("李强");
        response2025.setEmployeeNameEn("smith");
        response2025.setInterviewCount2025(30);
        response2025.setLikeCount2025(8);
        response2025.setTopLikeReasons(Arrays.asList(
                "面试官有很强的个人专业魅力,让我更期待与之共事",
                "面试官详细介绍了岗位和业务,让我更期待加入腾讯"
        ));

        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(response2025);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        InterviewerH5DataResponse data = result.getData();
        assertEquals(30, data.getInterviewCount2025().intValue(), "2025年面试场次应该匹配");
        assertEquals(8, data.getLikeCount2025().intValue(), "2025年总被点赞量应该匹配");

        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("边界条件 - 面试官ID为最小值")
    void shouldHandleMinimumInterviewerId() {
        // Arrange
        Long interviewerId = 1L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("边界条件 - 面试官ID为较大值")
    void shouldHandleLargeInterviewerId() {
        // Arrange
        Long interviewerId = 999999L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("边界条件 - 返回数据中评价词条为空列表")
    void shouldHandleEmptyTopLikeReasons() {
        // Arrange
        Long interviewerId = 12L;
        mockResponse.setTopLikeReasons(Collections.emptyList());
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        assertNotNull(result.getData().getTopLikeReasons(), "评价词条列表不应为null");
        assertTrue(result.getData().getTopLikeReasons().isEmpty(), "评价词条列表应该为空");
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("边界条件 - 返回数据中某些统计值为0")
    void shouldHandleZeroStatistics() {
        // Arrange
        Long interviewerId = 12L;
        mockResponse.setInterviewCount2025(0);
        mockResponse.setLikeCount2025(0);
        mockResponse.setTotalInterviewCount(0);
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "返回结果不应为空");
        assertTrue(result.isSuccess(), "请求应该成功");
        InterviewerH5DataResponse data = result.getData();
        assertEquals(0, data.getInterviewCount2025().intValue(), "2025年面试场次应该为0");
        assertEquals(0, data.getLikeCount2025().intValue(), "2025年总被点赞量应该为0");
        assertEquals(0, data.getTotalInterviewCount().intValue(), "总面试场次应该为0");
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("异常场景 - Service抛出业务异常")
    void shouldHandleServiceException() {
        // Arrange
        Long interviewerId = 12L;
        String errorMessage = "面试官数据不存在";
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenThrow(new RuntimeException(errorMessage));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            openApiController.getInterviewerH5Data(interviewerId);
        }, "应该抛出RuntimeException");

        assertEquals(errorMessage, exception.getMessage(), "异常信息应该匹配");
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
    }

    @Test
    @DisplayName("Mock验证 - 确保Service方法被正确调用")
    void shouldVerifyServiceMethodInvocation() {
        // Arrange
        Long interviewerId = 12L;
        when(interviewerH5DataService.getInterviewerH5Data(any(Long.class)))
                .thenReturn(mockResponse);

        // Act
        openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(interviewerId);
        verify(interviewerH5DataService, times(1)).getInterviewerH5Data(any(Long.class));
        verifyNoMoreInteractions(interviewerH5DataService);
    }

    @Test
    @DisplayName("Mock验证 - 参数匹配验证")
    void shouldVerifyParameterMatching() {
        // Arrange
        Long interviewerId = 47L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        openApiController.getInterviewerH5Data(interviewerId);

        // Assert - 验证确切的参数值
        verify(interviewerH5DataService).getInterviewerH5Data(eq(47L));
        verify(interviewerH5DataService, never()).getInterviewerH5Data(eq(12L));
    }

    @Test
    @DisplayName("正常场景 - 验证返回的Result对象结构正确")
    void shouldReturnCorrectResultStructure() {
        // Arrange
        Long interviewerId = 12L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        assertNotNull(result, "Result对象不应为空");
        assertTrue(result.isSuccess(), "Result应该表示成功");
        assertNotNull(result.getData(), "Result中的data不应为空");
        assertNull(result.getCode(), "成功时errorCode应该为空");
    }

    @Test
    @DisplayName("正常场景 - 验证所有字段类型正确")
    void shouldReturnCorrectFieldTypes() {
        // Arrange
        Long interviewerId = 12L;
        when(interviewerH5DataService.getInterviewerH5Data(interviewerId))
                .thenReturn(mockResponse);

        // Act
        Result<InterviewerH5DataResponse> result = openApiController.getInterviewerH5Data(interviewerId);

        // Assert
        InterviewerH5DataResponse data = result.getData();
        assertNotNull(data, "响应数据不应为空");

        // 验证字段类型
        assertTrue(data.getEmployeeId() instanceof Long, "employeeId应该是Long类型");
        assertTrue(data.getEmployeeNameCn() instanceof String, "employeeNameCn应该是String类型");
        assertTrue(data.getEmployeeNameEn() instanceof String, "employeeNameEn应该是String类型");
        assertTrue(data.getTotalInterviewCount() instanceof Integer, "totalInterviewCount应该是Integer类型");
        assertTrue(data.getLongestTenureYears() instanceof BigDecimal, "longestTenureYears应该是BigDecimal类型");
        assertTrue(data.getCompanyTotalCommentWords() instanceof Long, "companyTotalCommentWords应该是Long类型");
    }
}
