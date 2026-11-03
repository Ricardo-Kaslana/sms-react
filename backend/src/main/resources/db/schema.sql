-- 学生管理系统数据库初始化脚本
-- 注意：脚本会先删除已有表再重建，请勿直接用于生产环境

CREATE DATABASE IF NOT EXISTS `student_management_system`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `student_management_system`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `t_grade`;
DROP TABLE IF EXISTS `t_log`;
DROP TABLE IF EXISTS `t_student`;
DROP TABLE IF EXISTS `t_subject`;
DROP TABLE IF EXISTS `t_class`;
DROP TABLE IF EXISTS `t_user`;

CREATE TABLE `t_user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码（BCrypt 哈希）',
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色：ROLE_ADMIN / ROLE_TEACHER',
  `full_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户姓名',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像访问路径',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

CREATE TABLE `t_class` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '班级ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '班级名称',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='班级表';

CREATE TABLE `t_subject` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '科目ID',
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '科目名称',
  `credits` decimal(3,1) NOT NULL DEFAULT '0.0' COMMENT '学分',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='科目表';

CREATE TABLE `t_student` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '学生ID',
  `student_no` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '学号',
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '学生姓名',
  `gender` enum('男','女') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '男' COMMENT '性别',
  `class_id` int unsigned NOT NULL COMMENT '所属班级ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_no` (`student_no`),
  KEY `idx_class_id` (`class_id`),
  CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `t_class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生表';

CREATE TABLE `t_grade` (
  `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '成绩ID',
  `student_id` int unsigned NOT NULL COMMENT '学生ID',
  `subject_id` int unsigned NOT NULL COMMENT '科目ID',
  `score` decimal(5,2) NOT NULL COMMENT '分数（允许两位小数）',
  `term` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '所属学期（例如：2023-2024第一学期）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '录入时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_student_subject_term` (`student_id`,`subject_id`,`term`) COMMENT '一个学生在一学期内一门科目只能有一个成绩',
  KEY `idx_student_id` (`student_id`),
  KEY `idx_subject_id` (`subject_id`),
  CONSTRAINT `fk_grade_student` FOREIGN KEY (`student_id`) REFERENCES `t_student` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_grade_subject` FOREIGN KEY (`subject_id`) REFERENCES `t_subject` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='成绩表';

CREATE TABLE `t_log` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `operator` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作人用户名',
  `operation` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '操作内容描述',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '操作人IP地址',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统操作日志表';

SET FOREIGN_KEY_CHECKS = 1;
