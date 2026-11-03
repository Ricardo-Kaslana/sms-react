package cn.lvb.education.security;
// 过滤器 实现无状态认证的关键 它会拦截每一个请求，从请求头中获取JWT，然后触发Shiro的登录流程。

import cn.lvb.education.security.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.ExpiredCredentialsException;
import org.apache.shiro.web.filter.authc.AuthenticatingFilter;
import org.apache.shiro.web.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
public class JwtFilter extends AuthenticatingFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StringRedisTemplate redisTemplate; // 注入 StringRedisTemplate

    /**
     * 从请求中获取JWT，并封装成自定义的 JwtToken
     */
    @Override
    protected AuthenticationToken createToken(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String jwt = request.getHeader("Authorization");

        if (!StringUtils.hasText(jwt)) {
            return null;
        }
        return new JwtToken(jwt);
    }

    /**
     * 拦截请求，判断是否需要进行认证
     * 如果请求中没有携带token，或者token校验失败，都会进入 onLoginFailure 方法
     */
    @Override
    protected boolean onAccessDenied(ServletRequest servletRequest, ServletResponse servletResponse) throws Exception {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String jwt = request.getHeader("Authorization");

        if (!StringUtils.hasText(jwt)) {
            return onLoginFailure(null, new AuthenticationException("请先登录"), servletRequest, servletResponse);
        }

        // 检查JWT是否在黑名单中
        Boolean isBlacklisted = redisTemplate.hasKey("jwt_blacklist:" + jwt);
        if (Boolean.TRUE.equals(isBlacklisted)) {
            return onLoginFailure(new JwtToken(jwt), new AuthenticationException("Token is blacklisted, please login again."), servletRequest, servletResponse);
        }

        // 校验JWT
        try {
            Claims claims = jwtUtil.getClaimsByToken(jwt);
            if (claims == null || jwtUtil.isTokenExpired(claims)) {
                return onLoginFailure(new JwtToken(jwt), new ExpiredCredentialsException("Token has expired, please log in again."), servletRequest, servletResponse);
            }
        } catch (Exception e) {
            log.error("Token validation error", e);
            return onLoginFailure(new JwtToken(jwt), new AuthenticationException(e), servletRequest, servletResponse);
        }

        // 认证流程，成功后会放行
        return executeLogin(servletRequest, servletResponse);
    }

    /**
     * 认证失败时的处理
     * 不进行重定向，而是返回JSON格式的错误信息
     */
    @Override
    protected boolean onLoginFailure(AuthenticationToken token, AuthenticationException e, ServletRequest request, ServletResponse response) {
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        try {
            // 处理认证失败的异常
            Throwable throwable = e.getCause() == null ? e : e.getCause();

            httpResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpResponse.setContentType("application/json;charset=UTF-8");

            Map<String, Object> result = new HashMap<>();
            result.put("code", 401);
            result.put("message", "Login failed: " + throwable.getMessage());

            ObjectMapper objectMapper = new ObjectMapper();
            httpResponse.getWriter().print(objectMapper.writeValueAsString(result));

        } catch (IOException ioException) {
            log.error("Response writing error", ioException);
        }
        return false; // 终止后续的过滤器链
    }

    /**
     * 对跨域提供支持
     */
    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        HttpServletRequest httpServletRequest = WebUtils.toHttp(request);
        HttpServletResponse httpServletResponse = WebUtils.toHttp(response);
        String origin = httpServletRequest.getHeader("Origin");
        String requestHeaders = httpServletRequest.getHeader("Access-Control-Request-Headers");
        httpServletResponse.setHeader("Access-Control-Allow-Origin", origin != null ? origin : "*");
        httpServletResponse.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
        httpServletResponse.setHeader("Access-Control-Allow-Headers",
                requestHeaders != null ? requestHeaders : "Authorization,Content-Type");
        httpServletResponse.setHeader("Access-Control-Max-Age", "3600");
        // 跨域时会首先发送一个OPTIONS请求，这里我们给OPTIONS请求直接返回正常状态
        if (httpServletRequest.getMethod().equals(org.springframework.http.HttpMethod.OPTIONS.name())) {
            httpServletResponse.setStatus(HttpStatus.OK.value());
            return false;
        }
        return super.preHandle(request, response);
    }
}
