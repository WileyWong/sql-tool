-- 面试官统计数据表结构设计
-- 创建时间: 2025-12-08
-- 用途: 存储面试官基本信息和面试统计数据

-- 1. 面试官基本信息与统计表
CREATE TABLE IF NOT EXISTS `interviewer_statistics` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `interviewer_id` BIGINT(20) NOT NULL COMMENT '面试官ID',
    `interviewer_name_cn` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '面试官中文名',
    `interviewer_name_en` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '面试官英文名',
    `first_interview_date` DATE NULL COMMENT '初任面试官时间',
    `interviewer_days` INT(11) NOT NULL DEFAULT 0 COMMENT '担任面试官时长(天)',
    `interviewer_years_text` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '担任面试官时长(年月日)',
    
    -- 2025年统计数据
    `interview_count_2025` INT(11) NOT NULL DEFAULT 0 COMMENT '2025年面试总场次',
    `interview_duration_2025` INT(11) NOT NULL DEFAULT 0 COMMENT '2025年集团面试时长(min)',
    `comment_words_2025` INT(11) NOT NULL DEFAULT 0 COMMENT '2025年集团面评总字数',
    `like_count_2025` INT(11) NOT NULL DEFAULT 0 COMMENT '2025年问卷点赞数',
    `good_review_count_2025` INT(11) NOT NULL DEFAULT 0 COMMENT '2025年问卷好评数',
    
    -- 历史统计数据
    `total_interview_count` INT(11) NOT NULL DEFAULT 0 COMMENT '成为面试官以来完成的面试场次',
    `total_interview_duration` INT(11) NOT NULL DEFAULT 0 COMMENT '成为面试官以来累计面试时长(min)',
    `max_daily_interviews` INT(11) NOT NULL DEFAULT 0 COMMENT '成为面试官以来单日最多面试人次',
    `max_daily_interview_dates` TEXT NULL COMMENT '单日最大面试量的日期(逗号分隔)',
    `hired_count` INT(11) NOT NULL DEFAULT 0 COMMENT '面试人数最终入职人数',
    `longest_tenure_years` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '入职人数最长年限',
    
    -- 审计字段
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标志 1-启用 0-禁用',
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_interviewer_id` (`interviewer_id`),
    KEY `idx_enable_interviewer` (`enable_flag`, `interviewer_id`),
    KEY `idx_create_time` (`create_time`),
    KEY `idx_update_time` (`update_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试官统计信息表';


-- 2. 面试点赞数据表
CREATE TABLE IF NOT EXISTS `interview_like_statistics` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `interviewer_id` BIGINT(20) NOT NULL COMMENT '面试官ID',
    `like_reason` VARCHAR(500) NOT NULL DEFAULT '' COMMENT '点赞原因/评价词条',
    `like_count` INT(11) NOT NULL DEFAULT 0 COMMENT '该评价词条被点赞次数',
    
    -- 审计字段
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标志 1-启用 0-禁用',
    
    PRIMARY KEY (`id`),
    KEY `idx_interviewer_enable_like` (`interviewer_id`, `enable_flag`, `like_count`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试点赞统计表';


-- 3. 全公司统计数据表
CREATE TABLE IF NOT EXISTS `company_statistics_2025` (
    `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `stat_year` INT(4) NOT NULL DEFAULT 2025 COMMENT '统计年份',
    `total_interviewers` INT(11) NOT NULL DEFAULT 0 COMMENT '参与面试的面试官人数',
    `total_interviews` INT(11) NOT NULL DEFAULT 0 COMMENT '集团面试场数',
    `total_interview_duration` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '集团面试时长(min)',
    `total_comment_words` BIGINT(20) NOT NULL DEFAULT 0 COMMENT '集团面评总字数',
    
    -- 审计字段
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `enable_flag` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '启用标志 1-启用 0-禁用',
    
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_stat_year` (`stat_year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='全公司年度统计表';
