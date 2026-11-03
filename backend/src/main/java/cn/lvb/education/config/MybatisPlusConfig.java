package cn.lvb.education.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Slf4j
@Configuration
public class MybatisPlusConfig {

    /**
     * 注册一个 Mybatis-Plus 的公共字段自动填充处理器
     * 配置类对所有配置了@TableField(fill = ...)的实体都生效
     * MetaObjectHandler接口的 Bean。这个 Handler 负责定义具体的填充逻辑。
     */
    @Bean
    public MetaObjectHandler metaObjectHandler() {
        return new MetaObjectHandler() {
            @Override
            public void insertFill(MetaObject metaObject) {
                log.info("start insert fill ....");
                // setFieldValByName(字段名, 填充值, metaObject)
                this.strictInsertFill(metaObject, "createTime", LocalDateTime::now, LocalDateTime.class);
                // 也可以同时为 updateTime 填充
                this.strictInsertFill(metaObject, "updateTime", LocalDateTime::now, LocalDateTime.class);
            }

            @Override
            public void updateFill(MetaObject metaObject) {
                log.info("start update fill ....");
                this.strictUpdateFill(metaObject, "updateTime", LocalDateTime::now, LocalDateTime.class);
            }
        };
    }

    /**
     * 注册 Mybatis-Plus 的分页插件
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页插件，并指定数据库类型为 MySQL
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
