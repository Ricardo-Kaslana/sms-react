package cn.lvb.education.config;

import cn.lvb.education.security.JwtFilter;
import cn.lvb.education.security.UserRealm;
import org.apache.shiro.authc.pam.FirstSuccessfulStrategy;
import org.apache.shiro.authc.pam.ModularRealmAuthenticator;
import org.apache.shiro.authz.Authorizer;
import org.apache.shiro.authz.ModularRealmAuthorizer;
import org.apache.shiro.event.EventBus;
import org.apache.shiro.event.support.DefaultEventBus;
import org.apache.shiro.mgt.DefaultSessionStorageEvaluator;
import org.apache.shiro.mgt.DefaultSubjectDAO;
import org.apache.shiro.mgt.SecurityManager;
import org.apache.shiro.session.mgt.SessionManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Lazy;

import javax.servlet.Filter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

@Configuration
public class ShiroConfig {

    //关闭shiro自动配置 手动声明需要的所有Bean

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter();
    }

    /**
     * JwtFilter 只应在 Shiro 过滤链中生效。
     * 禁用 Spring Boot 对 Filter Bean 的自动全局注册，避免匿名接口被拦截。
     */
    @Bean
    public FilterRegistrationBean<JwtFilter> jwtFilterRegistration(JwtFilter jwtFilter) {
        FilterRegistrationBean<JwtFilter> registration = new FilterRegistrationBean<>(jwtFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public EventBus eventBus() {
        return new DefaultEventBus();
    }

    // Authorizer配置
    @Bean
    public Authorizer authorizer() {
        return new ModularRealmAuthorizer();
    }

    // 会话管理器配置
    @Bean
    public SessionManager sessionManager() {
        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
        sessionManager.setSessionValidationSchedulerEnabled(false); // 禁用定时验证
        return sessionManager;
    }

    // 声明生命周期处理器
    @Bean
    public static LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    // 支持Shiro注解
    @Bean
    @DependsOn("lifecycleBeanPostProcessor")
    public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator() {
        DefaultAdvisorAutoProxyCreator creator = new DefaultAdvisorAutoProxyCreator();
        creator.setProxyTargetClass(true);
        return creator;
    }

    // 显式声明 authenticator
    @Bean
    public ModularRealmAuthenticator authenticator() {
        ModularRealmAuthenticator authenticator = new ModularRealmAuthenticator();
        authenticator.setAuthenticationStrategy(new FirstSuccessfulStrategy());
        return authenticator;
    }

    @Bean
    public SecurityManager securityManager(UserRealm userRealm, SessionManager sessionManager) {
        DefaultWebSecurityManager securityManager = new DefaultWebSecurityManager();
        securityManager.setRealm(userRealm);
        securityManager.setSessionManager(sessionManager); // 注入sessionManager
        // 手动设置authenticator
        securityManager.setAuthenticator(authenticator());

        /*
         * 关闭shiro自带的session，完全使用JWT
         */
        DefaultSubjectDAO subjectDAO = new DefaultSubjectDAO();
        DefaultSessionStorageEvaluator evaluator = new DefaultSessionStorageEvaluator();
        evaluator.setSessionStorageEnabled(false);
        subjectDAO.setSessionStorageEvaluator(evaluator);
        securityManager.setSubjectDAO(subjectDAO);

        return securityManager;
    }

    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager, JwtFilter jwtFilter) {
        ShiroFilterFactoryBean factoryBean = new ShiroFilterFactoryBean();
        factoryBean.setSecurityManager(securityManager);

        // 添加JWT过滤器
        Map<String, Filter> filters = new HashMap<>();
        filters.put("jwt", jwtFilter);
        factoryBean.setFilters(filters);

        // 设置过滤规则
        Map<String, String> filterMap = new LinkedHashMap<>();
        filterMap.put("/user/login", "anon");
        filterMap.put("/captcha", "anon");
        filterMap.put("/avatars/**", "anon");
        filterMap.put("/swagger*/**", "anon");
        filterMap.put("/v3/api-docs", "anon");
        filterMap.put("/**", "jwt");
        factoryBean.setFilterChainDefinitionMap(filterMap);

        return factoryBean;
    }

}
