package cn.lvb.education.exception;
// 全局错误处理

import cn.lvb.education.vo.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.UnauthenticatedException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 处理 Shiro 的认证和授权异常

    /**
     * 专门处理 Shiro 认证异常 (未登录、token过期等)
     * 所有这些情况都应该让用户重新登录。
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 返回 401
    @ExceptionHandler({UnauthenticatedException.class, AuthenticationException.class})
    public ApiResponse<Object> handleAuthenticationException(Exception e) {
        log.error("Shiro认证异常: {}", e.getMessage());
        return ApiResponse.fail(HttpStatus.UNAUTHORIZED.value(), "登录凭证已过期，请重新登录");
    }

    /**
     * Shiro 授权异常 (权限不足)
     * 用户已登录，但角色或权限不够。
     */
    @ResponseStatus(HttpStatus.FORBIDDEN) // 返回 403
    @ExceptionHandler(AuthorizationException.class)
    public ApiResponse<Object> handleAuthorizationException(AuthorizationException e) {
        log.error("Shiro授权异常: {}", e.getMessage());
        return ApiResponse.fail(HttpStatus.FORBIDDEN.value(), "您没有权限执行此操作");
    }

    // 处理 @Valid 注解的参数校验异常
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 返回400状态码
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Object> handleValidationException(MethodArgumentNotValidException e) {
        log.error("实体校验异常: -------------", e);
        BindingResult bindingResult = e.getBindingResult();
        ObjectError objectError = bindingResult.getAllErrors().stream().findFirst().get();
        return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), objectError.getDefaultMessage());
    }

    // 处理自定义的业务异常，例如登录时用户名密码错误
    @ResponseStatus(HttpStatus.BAD_REQUEST) // 返回400状态码
    @ExceptionHandler(IllegalArgumentException.class)
    public ApiResponse<Object> handleIllegalArgumentException(IllegalArgumentException e) {
        log.error("Assert断言异常: -------------", e);
        return ApiResponse.fail(HttpStatus.BAD_REQUEST.value(), e.getMessage());
    }

    // 最终的通用异常处理
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR) // 返回500状态码
    @ExceptionHandler(RuntimeException.class)
    public ApiResponse<Object> handleRuntimeException(RuntimeException e) {
        log.error("系统运行时异常: -------------", e);
        return ApiResponse.fail(HttpStatus.INTERNAL_SERVER_ERROR.value(), "系统繁忙，请稍后再试");
    }
}
