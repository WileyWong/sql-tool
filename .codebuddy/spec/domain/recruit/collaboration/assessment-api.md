# 测评平台 API

> **领域**: Assessment | **服务**: assessment-platform | **版本**: v1.9

---

## 📋 接口概览

测评平台提供在线测评、能力评估、报告下载等功能，支持多种测评类型，包括：

- 测评订单管理
- 测评报告查询和下载
- 测评结果分析
- 批量订单处理

**接口文档**: http://test-assessment.woa.com/api/pub/assessment-platform-tenant/doc.html

---

## 🔌 FeignClient 接口

### AssessmentApi

**服务名称**: `assessment-platform`  
**配置类**: `RecruitFeignHeaderInterceptor`, `AssessmentFeignHeaderInterceptor`  
**服务地址**:
- 生产环境: `${NTS_GW_ESB}/assessment-platform`
- 测试环境: `${DEV_NTS_GW_ESB}/assessment-platform`

---

## 📡 接口详情

### 1. 测评订单查询

#### 1.1 批量查询测评订单

```java
@PostMapping(value = "/api/openapi/report/result-batch")
AssessmentResult<List<AssessmentOrderDTO>> getOrders(
    @RequestBody List<String> orderIds,
    @RequestHeader(value = "caagw-corpkey", defaultValue = "tencent") String corpKey,
    @RequestHeader(value = "staffid") Long staffId,
    @RequestHeader(value = "staffname") String staffName
);
```

**参数说明**:
- `orderIds`: 订单 ID 列表（批量查询，建议每次不超过 50 个）
- **Header 参数**:
  - `caagw-corpkey`: 企业标识，默认 `tencent`
  - `staffid`: 员工 ID（必填）
  - `staffname`: 员工姓名（必填）

**返回值**: `AssessmentResult<List<AssessmentOrderDTO>>`

**订单状态说明**:
- `0`: 待测评
- `1`: 测评中
- `2`: 已完成
- `3`: 已取消

**使用示例**:

```java
@Autowired
private AssessmentApi assessmentApi;

// 批量查询测评订单
public Map<String, AssessmentOrderDTO> queryOrders(List<String> orderIds, Long staffId, String staffName) {
    AssessmentResult<List<AssessmentOrderDTO>> result = 
        assessmentApi.getOrders(orderIds, "tencent", staffId, staffName);
    
    if (result.isSuccess()) {
        return result.getData().stream()
            .collect(Collectors.toMap(
                AssessmentOrderDTO::getOrderId,
                Function.identity()
            ));
    } else {
        log.error("查询测评订单失败: {}", result.getMessage());
        return Collections.emptyMap();
    }
}

// 检查订单状态
public boolean isOrderCompleted(String orderId, Long staffId, String staffName) {
    List<String> orderIds = Collections.singletonList(orderId);
    AssessmentResult<List<AssessmentOrderDTO>> result = 
        assessmentApi.getOrders(orderIds, "tencent", staffId, staffName);
    
    if (result.isSuccess() && !result.getData().isEmpty()) {
        AssessmentOrderDTO order = result.getData().get(0);
        return order.getStatus() == 2; // 2-已完成
    }
    
    return false;
}
```

---

### 2. 测评报告下载

#### 2.1 下载测评报告

```java
@GetMapping(value = "/api/openapi/report/download")
AssessmentResult<AssessmentReportDataDTO> downloadReport(
    @RequestParam(value = "reportId") String reportId,
    @RequestHeader(value = "caagw-corpkey", defaultValue = "tencent") String corpKey,
    @RequestHeader(value = "staffid") Long staffId,
    @RequestHeader(value = "staffname") String staffName
);
```

**参数说明**:
- `reportId`: 报告 ID（从订单信息中获取）
- **Header 参数**:
  - `caagw-corpkey`: 企业标识
  - `staffid`: 员工 ID（必填）
  - `staffname`: 员工姓名（必填）

**返回值**: `AssessmentResult<AssessmentReportDataDTO>`
- 报告数据通常为 Base64 编码的 PDF 文件
- 需要解码后保存或展示

**使用示例**:

```java
/**
 * 下载并保存测评报告
 */
public String downloadAndSaveReport(String reportId, Long staffId, String staffName) {
    AssessmentResult<AssessmentReportDataDTO> result = 
        assessmentApi.downloadReport(reportId, "tencent", staffId, staffName);
    
    if (result.isSuccess()) {
        AssessmentReportDataDTO reportData = result.getData();
        
        // 解码 Base64 数据
        byte[] pdfBytes = Base64.getDecoder().decode(reportData.getReportContent());
        
        // 保存到本地文件
        String fileName = "assessment_report_" + reportId + ".pdf";
        String filePath = "/tmp/reports/" + fileName;
        
        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            fos.write(pdfBytes);
            log.info("报告已保存: {}", filePath);
            return filePath;
        } catch (IOException e) {
            log.error("保存报告失败", e);
            return null;
        }
    } else {
        log.error("下载报告失败: {}", result.getMessage());
        return null;
    }
}

/**
 * 下载报告并返回给前端
 */
@GetMapping("/download/report/{reportId}")
public void downloadReportToFrontend(
    @PathVariable String reportId,
    @RequestHeader("X-Staff-Id") Long staffId,
    @RequestHeader("X-Staff-Name") String staffName,
    HttpServletResponse response
) throws IOException {
    AssessmentResult<AssessmentReportDataDTO> result = 
        assessmentApi.downloadReport(reportId, "tencent", staffId, staffName);
    
    if (result.isSuccess()) {
        AssessmentReportDataDTO reportData = result.getData();
        byte[] pdfBytes = Base64.getDecoder().decode(reportData.getReportContent());
        
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", 
            "attachment; filename=assessment_report_" + reportId + ".pdf");
        response.getOutputStream().write(pdfBytes);
        response.getOutputStream().flush();
    } else {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        response.getWriter().write("下载报告失败: " + result.getMessage());
    }
}
```

---

## 📊 数据模型

### AssessmentOrderDTO

```java
public class AssessmentOrderDTO {
    private String orderId;           // 订单 ID
    private String orderNo;           // 订单编号
    private Integer status;           // 订单状态：0-待测评，1-测评中，2-已完成，3-已取消
    private String reportId;          // 报告 ID
    private Long candidateId;         // 候选人 ID
    private String candidateName;     // 候选人姓名
    private String assessmentType;    // 测评类型
    private Date createTime;          // 创建时间
    private Date completeTime;        // 完成时间
    private Integer score;            // 测评分数
    private String level;             // 测评等级：A/B/C/D
}
```

### AssessmentReportDataDTO

```java
public class AssessmentReportDataDTO {
    private String reportId;          // 报告 ID
    private String reportContent;     // 报告内容（Base64 编码）
    private String reportFormat;      // 报告格式：PDF/HTML
    private Integer fileSize;         // 文件大小（字节）
    private Date generateTime;        // 生成时间
}
```

### AssessmentResult<T>

```java
public class AssessmentResult<T> {
    private Boolean success;          // 是否成功
    private String code;              // 错误码
    private String message;           // 错误信息
    private T data;                   // 返回数据
    
    public boolean isSuccess() {
        return success != null && success;
    }
}
```

---

## ⚠️ 注意事项

### 1. 认证参数必填

- **Header 参数缺失会导致 401 认证失败**
- 必须传入正确的 `corpKey`、`staffId`、`staffName`
- `staffId` 和 `staffName` 需要与实际用户信息一致

### 2. 批量查询限制

- 单次查询订单 ID 数量建议不超过 50 个
- 超大批量建议分批次查询

### 3. 报告下载注意事项

- 报告内容通常为 Base64 编码
- 需要先解码再保存或展示
- PDF 文件可能较大，注意内存使用

### 4. 测评状态轮询

- 测评可能需要一定时间完成
- 建议使用定时任务轮询状态
- 避免频繁查询，建议间隔 30 秒以上

---

## 💡 最佳实践

### 测评订单状态轮询

```java
@Service
public class AssessmentService {
    
    @Autowired
    private AssessmentApi assessmentApi;
    
    /**
     * 轮询订单状态直到完成
     */
    @Async
    public CompletableFuture<AssessmentOrderDTO> waitForCompletion(
        String orderId, 
        Long staffId, 
        String staffName,
        int maxWaitMinutes
    ) {
        int maxAttempts = maxWaitMinutes * 2; // 每 30 秒查询一次
        int attempt = 0;
        
        while (attempt < maxAttempts) {
            try {
                List<String> orderIds = Collections.singletonList(orderId);
                AssessmentResult<List<AssessmentOrderDTO>> result = 
                    assessmentApi.getOrders(orderIds, "tencent", staffId, staffName);
                
                if (result.isSuccess() && !result.getData().isEmpty()) {
                    AssessmentOrderDTO order = result.getData().get(0);
                    
                    if (order.getStatus() == 2) {
                        // 已完成
                        log.info("测评订单 {} 已完成", orderId);
                        return CompletableFuture.completedFuture(order);
                    } else if (order.getStatus() == 3) {
                        // 已取消
                        log.warn("测评订单 {} 已取消", orderId);
                        return CompletableFuture.completedFuture(order);
                    } else {
                        log.info("测评订单 {} 状态: {}, 继续等待...", orderId, order.getStatus());
                    }
                }
                
                // 等待 30 秒
                Thread.sleep(30000);
                attempt++;
            } catch (Exception e) {
                log.error("查询订单状态失败", e);
                attempt++;
            }
        }
        
        log.warn("测评订单 {} 等待超时", orderId);
        return CompletableFuture.completedFuture(null);
    }
}
```

### 批量订单处理

```java
@Service
public class BatchAssessmentService {
    
    @Autowired
    private AssessmentApi assessmentApi;
    
    private static final int BATCH_SIZE = 50;
    
    /**
     * 批量查询订单（自动分批）
     */
    public Map<String, AssessmentOrderDTO> batchQueryOrders(
        List<String> allOrderIds,
        Long staffId,
        String staffName
    ) {
        Map<String, AssessmentOrderDTO> resultMap = new HashMap<>();
        
        // 分批查询
        List<List<String>> batches = partition(allOrderIds, BATCH_SIZE);
        
        for (int i = 0; i < batches.size(); i++) {
            List<String> batch = batches.get(i);
            log.info("查询第 {}/{} 批订单，共 {} 个", i + 1, batches.size(), batch.size());
            
            try {
                AssessmentResult<List<AssessmentOrderDTO>> result = 
                    assessmentApi.getOrders(batch, "tencent", staffId, staffName);
                
                if (result.isSuccess()) {
                    result.getData().forEach(order -> 
                        resultMap.put(order.getOrderId(), order)
                    );
                } else {
                    log.error("查询第 {} 批订单失败: {}", i + 1, result.getMessage());
                }
                
                // 避免过于频繁调用
                if (i < batches.size() - 1) {
                    Thread.sleep(100);
                }
            } catch (Exception e) {
                log.error("查询第 {} 批订单异常", i + 1, e);
            }
        }
        
        return resultMap;
    }
    
    /**
     * 将列表分批
     */
    private <T> List<List<T>> partition(List<T> list, int size) {
        List<List<T>> batches = new ArrayList<>();
        for (int i = 0; i < list.size(); i += size) {
            batches.add(list.subList(i, Math.min(i + size, list.size())));
        }
        return batches;
    }
}
```

### 测评报告缓存

```java
@Service
public class AssessmentReportService {
    
    @Autowired
    private AssessmentApi assessmentApi;
    
    // 报告缓存（避免重复下载）
    private final Cache<String, byte[]> reportCache = 
        CacheBuilder.newBuilder()
            .expireAfterWrite(1, TimeUnit.HOURS)
            .maximumSize(100)
            .build();
    
    /**
     * 获取报告（带缓存）
     */
    public byte[] getReport(String reportId, Long staffId, String staffName) {
        try {
            return reportCache.get(reportId, () -> {
                log.info("下载测评报告: {}", reportId);
                AssessmentResult<AssessmentReportDataDTO> result = 
                    assessmentApi.downloadReport(reportId, "tencent", staffId, staffName);
                
                if (result.isSuccess()) {
                    String content = result.getData().getReportContent();
                    return Base64.getDecoder().decode(content);
                } else {
                    throw new RuntimeException("下载报告失败: " + result.getMessage());
                }
            });
        } catch (Exception e) {
            log.error("获取报告失败: {}", reportId, e);
            return null;
        }
    }
}
```

### 测评流程集成

```java
@Service
public class InterviewAssessmentService {
    
    @Autowired
    private AssessmentService assessmentService;
    
    @Autowired
    private FlowApi flowApi;
    
    /**
     * 完整的测评流程
     */
    public void processAssessment(Long flowMainId, String orderId, Long staffId, String staffName) {
        try {
            // 1. 等待测评完成（最多等待 30 分钟）
            CompletableFuture<AssessmentOrderDTO> future = 
                assessmentService.waitForCompletion(orderId, staffId, staffName, 30);
            
            AssessmentOrderDTO order = future.get();
            
            if (order != null && order.getStatus() == 2) {
                // 2. 测评已完成，更新流程
                log.info("测评完成，分数: {}, 等级: {}", order.getScore(), order.getLevel());
                
                // 3. 下载报告
                String reportPath = downloadReport(order.getReportId(), staffId, staffName);
                
                // 4. 更新流程状态
                updateFlowWithAssessment(flowMainId, order, reportPath);
                
                // 5. 发送通知
                sendNotification(flowMainId, order);
            } else {
                log.warn("测评未完成或已取消");
            }
        } catch (Exception e) {
            log.error("处理测评流程失败", e);
        }
    }
    
    private String downloadReport(String reportId, Long staffId, String staffName) {
        // 下载报告逻辑
        return null;
    }
    
    private void updateFlowWithAssessment(Long flowMainId, AssessmentOrderDTO order, String reportPath) {
        // 更新流程逻辑
    }
    
    private void sendNotification(Long flowMainId, AssessmentOrderDTO order) {
        // 发送通知逻辑
    }
}
```

---

## 🔗 相关文档

- [API 索引](./index.md)
- [面试管理 API](./interview-api.md)
- [流程管理 API](./flow-api.md)

---

**最后更新**: 2025-11-12
