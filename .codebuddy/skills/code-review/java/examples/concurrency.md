# 示例 3: 并发安全审查

## 场景描述

审查库存扣减的并发安全性。

## 代码示例

```java
// ❌ 错误：存在并发问题
@Service
public class InventoryService {
    
    public void deductStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new NotFoundException("商品不存在"));
        
        if (product.getStock() < quantity) {
            throw new BusinessException("库存不足");
        }
        
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
    }
}
```

## 改进建议

```java
// ✅ 正确：使用乐观锁保证并发安全
@Service
public class InventoryService {
    
    /**
     * 扣减库存（使用乐观锁）
     * 
     * @param productId 商品ID
     * @param quantity 扣减数量
     * @throws BusinessException 如果库存不足或并发冲突
     */
    @Transactional(rollbackFor = Exception.class)
    public void deductStock(Long productId, int quantity) {
        // 使用乐观锁版本号，防止并发问题
        int maxRetry = 3;
        for (int i = 0; i < maxRetry; i++) {
            try {
                Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new NotFoundException("商品不存在"));
                
                if (product.getStock() < quantity) {
                    throw new BusinessException("库存不足");
                }
                
                // MyBatis-Plus 会自动检查版本号
                product.setStock(product.getStock() - quantity);
                int updated = productRepository.updateById(product);
                
                if (updated > 0) {
                    return; // 更新成功
                }
            } catch (OptimisticLockException e) {
                if (i == maxRetry - 1) {
                    throw new BusinessException("系统繁忙，请稍后重试");
                }
                // 重试
            }
        }
    }
}

// 实体类使用 @Version 注解
@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Integer stock;
    
    @Version // 乐观锁版本号
    private Integer version;
}
```

## 审查要点

| 检查项 | 说明 |
|--------|------|
| 乐观锁 | 使用 `@Version` 注解实现乐观锁 |
| 重试机制 | 乐观锁冲突时进行有限次重试 |
| 事务控制 | 确保整个操作在事务中执行 |
| 异常处理 | 重试耗尽后抛出友好的业务异常 |
