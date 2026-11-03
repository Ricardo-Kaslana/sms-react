package cn.lvb.education.aspect;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义操作日志记录注解
 */
@Target(ElementType.METHOD) // 注解作用于方法上
@Retention(RetentionPolicy.RUNTIME) // 注解在运行时可见
public @interface LogOperation {
    /**
     * 操作内容的描述，例如 "新增用户", "删除班级" 等
     */
    String value() default "";
}
