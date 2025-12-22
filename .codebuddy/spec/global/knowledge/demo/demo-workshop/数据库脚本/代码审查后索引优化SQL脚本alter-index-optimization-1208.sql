-- =====================================================
-- 索引优化变更脚本
-- 创建时间: 2025-12-08
-- 用途: 为已存在的表添加优化后的复合索引
-- 执行前请备份数据库!!!
-- =====================================================

USE recruit_bole;

-- =====================================================
-- 1. 优化 interviewer_statistics 表索引
-- =====================================================

-- 添加复合索引: (enable_flag, interviewer_id)
-- 用于优化批量查询场景: WHERE enable_flag = 1 ORDER BY interviewer_id
ALTER TABLE `interviewer_statistics` 
ADD INDEX `idx_enable_interviewer` (`enable_flag`, `interviewer_id`)
COMMENT '启用标志+面试官ID复合索引，优化批量查询排序';

-- =====================================================
-- 2. 优化 interview_like_statistics 表索引
-- =====================================================

-- 删除冗余的单列索引（将被复合索引覆盖）
ALTER TABLE `interview_like_statistics` 
DROP INDEX IF EXISTS `idx_interviewer_id`;

ALTER TABLE `interview_like_statistics` 
DROP INDEX IF EXISTS `idx_like_count`;

-- 添加复合索引: (interviewer_id, enable_flag, like_count)
-- 用于优化TOP N查询: WHERE interviewer_id = ? AND enable_flag = 1 ORDER BY like_count DESC LIMIT N
ALTER TABLE `interview_like_statistics` 
ADD INDEX `idx_interviewer_enable_like` (`interviewer_id`, `enable_flag`, `like_count`)
COMMENT '面试官ID+启用标志+点赞数复合索引，优化TOP N查询';

-- =====================================================
-- 3. 验证索引创建结果
-- =====================================================

-- 查看 interviewer_statistics 表索引
SHOW INDEX FROM `interviewer_statistics`;

-- 查看 interview_like_statistics 表索引
SHOW INDEX FROM `interview_like_statistics`;

-- =====================================================
-- 4. 执行计划验证（可选）
-- =====================================================

-- 验证 interviewer_statistics 表查询计划
EXPLAIN SELECT * FROM interviewer_statistics
WHERE enable_flag = 1
ORDER BY interviewer_id;

-- 验证 interview_like_statistics 表查询计划
-- 注意：需要替换 123456 为实际存在的 interviewer_id
EXPLAIN SELECT * FROM interview_like_statistics
WHERE interviewer_id = 123456
AND enable_flag = 1
ORDER BY like_count DESC
LIMIT 2;

-- =====================================================
-- 5. 性能对比测试（可选）
-- =====================================================

-- 开启profiling
SET profiling = 1;

-- 执行测试查询（需替换真实ID）
SELECT * FROM interview_like_statistics
WHERE interviewer_id = 123456
AND enable_flag = 1
ORDER BY like_count DESC
LIMIT 2;

-- 查看性能数据
SHOW PROFILES;

-- 关闭profiling
SET profiling = 0;

-- =====================================================
-- 注意事项
-- =====================================================
-- 1. 在生产环境执行前，请在测试环境充分验证
-- 2. 建议在业务低峰期执行索引变更
-- 3. 大表添加索引可能需要较长时间，期间表会被锁定
-- 4. 执行前务必备份数据库
-- 5. 观察执行后的慢查询日志，确认优化效果
-- =====================================================
