# 领域特定知识索引

本目录存放特定业务领域的知识、规则、流程等。

## 📋 领域列表

*待补充*

## 如何添加领域知识

### 1. 创建领域目录

在 `domain-specific/` 下创建领域目录,如:
```
domain-specific/
└── ecommerce/          # 电商领域
    └── index.md
```

### 2. 编写领域索引

在领域目录下创建 `index.md`,包含:
- 领域概述
- 核心概念
- 业务流程
- 规则说明
- 相关文档链接

### 3. 添加详细文档

根据需要添加详细的子文档:
```
ecommerce/
├── index.md                # 领域索引
├── order-process.md        # 订单流程
├── payment-process.md      # 支付流程
├── inventory-management.md # 库存管理
└── business-rules.md       # 业务规则
```

## 领域文档模板

```markdown
# [领域名称]

## 领域概述
领域的定义、范围、核心价值。

## 核心概念

### 概念 1
定义和说明。

### 概念 2
定义和说明。

## 业务流程

### 流程 1
流程图和详细说明。

### 流程 2
流程图和详细说明。

## 业务规则

### 规则 1
规则说明和示例。

### 规则 2
规则说明和示例。

## 数据模型
核心实体和关系。

## 接口规范
对外提供的接口。

## 相关文档
- 需求文档
- 设计文档
- API 文档
```

## 示例领域

### 电商领域 (ecommerce)

**核心概念**:
- 商品 (Product)
- 订单 (Order)
- 购物车 (Cart)
- 支付 (Payment)
- 物流 (Logistics)

**核心流程**:
- 下单流程
- 支付流程
- 发货流程
- 退款流程

### 金融领域 (finance)

**核心概念**:
- 账户 (Account)
- 交易 (Transaction)
- 清算 (Settlement)
- 风控 (Risk Control)

**核心流程**:
- 开户流程
- 交易流程
- 清算流程
- 风控流程

### 招聘领域 (recruit)

**核心概念**:
- 职位 (Position)
- 候选人 (Candidate)
- 简历 (Resume)
- 面试 (Interview)

**核心流程**:
- 发布职位
- 简历筛选
- 面试安排
- Offer 发放
