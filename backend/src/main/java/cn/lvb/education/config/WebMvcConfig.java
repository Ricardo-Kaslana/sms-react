package cn.lvb.education.config;
// 映射静态资源

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.access-path}")
    private String accessPath;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 前后端分离开发时的跨域配置。生产环境请收敛 allowedOriginPatterns。
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        /**
         * 将 /avatars/** 映射到本地上传目录，目录可通过 file.upload-dir 配置
         */
        registry.addResourceHandler(accessPath + "**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
