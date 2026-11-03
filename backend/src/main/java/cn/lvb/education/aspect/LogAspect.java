package cn.lvb.education.aspect;
// 依赖于 AspectJ 包

import cn.lvb.education.entity.Log;
import cn.lvb.education.security.AccountProfile;
import cn.lvb.education.service.ILogService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.shiro.SecurityUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;

@Aspect
@Component
public class LogAspect {

    @Autowired
    private ILogService logService;

    @Autowired
    private ObjectMapper objectMapper; // Spring Boot 自动配置，用于序列化

    /**
     * 定义切点，切入点为被 @LogOperation 注解标记的方法
     */
    @Pointcut("@annotation(cn.lvb.education.aspect.LogOperation)")
    public void logPointCut() {
    }

    /**
     * 环绕通知，在方法执行前后进行操作
     */
    @Around("logPointCut()")
    public Object around(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        // 执行方法
        Object result = point.proceed();
        // 执行时长(毫秒)
        long time = System.currentTimeMillis() - beginTime;

        // 保存日志
        saveLog(point, time);

        return result;
    }

    private void saveLog(ProceedingJoinPoint joinPoint, long time) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Log logEntity = new Log();

        // 获取注解上的操作描述
        LogOperation logAnnotation = method.getAnnotation(LogOperation.class);
        if (logAnnotation != null) {
            logEntity.setOperation(logAnnotation.value());
        }

        // 获取请求的方法名
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = signature.getName();


        // 获取request
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        // 设置IP地址
        logEntity.setIpAddress(getIpAddr(request));

        // 获取当前操作用户
        // 对于登录操作，principal在方法执行前是null，执行后才会有
        AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
        if (profile != null) {
            logEntity.setOperator(profile.getUsername());
        } else {
            // 如果是登录操作，尝试从请求参数中获取用户名
            Object[] args = joinPoint.getArgs();
            if (args.length > 0 && args[0] instanceof cn.lvb.education.dto.LoginDTO) {
                cn.lvb.education.dto.LoginDTO loginDTO = (cn.lvb.education.dto.LoginDTO) args[0];
                logEntity.setOperator(loginDTO.getUsername() + " (尝试登录)");
            } else {
                logEntity.setOperator("Unknown/Anonymous");
            }
        }

        logService.save(logEntity);
    }

    /**
     * 获取用户IP地址
     */
    public String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip.contains(",")) {
            ip = ip.split(",")[0];
        }
        return ip;
    }
}

// 代码中注释掉了记录params（请求参数）的部分。因为如果记录登录操作，会将密码明文记录到日志中，这是非常危险的。
// 如果需要记录参数，必须对敏感信息（如密码、手机号）进行脱敏处理。
// 在 saveLog 方法中，对于登录操作，SecurityUtils.getSubject().getPrincipal() 可能是 null。我们需要特殊处理。
