package cn.lvb.education.config;
//JWT属性配置类
//创建一个类来接收 application.yml 中的JWT配置。

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private Long expire;
    private String header;
}
