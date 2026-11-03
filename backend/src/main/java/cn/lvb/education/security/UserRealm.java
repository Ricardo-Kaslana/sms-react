package cn.lvb.education.security;
// Realm是Shiro的核心组件，负责实际的认证和授权逻辑。自定义的 UserRealm 将会处理 JwtToken

import cn.lvb.education.entity.User;
import cn.lvb.education.security.util.JwtUtil;
import cn.lvb.education.service.IUserService;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class UserRealm extends AuthorizingRealm {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private IUserService userService;

    /**
     * jwt类型的Token
     */
    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }

    /**
     * 授权 (Authorization)
     * 当需要检查用户权限时（如 Controller 方法上有 @RequiresRoles 注解），此方法会被调用
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        log.debug("Executing Authorization logic...");
        AccountProfile accountProfile = (AccountProfile) principals.getPrimaryPrincipal();

        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        // 根据从JWT中获取的角色信息，为用户授予角色
        info.addRole(accountProfile.getRole());

        return info;
    }

    /**
     * 认证 (Authentication)
     * 当调用 subject.login(token) 时，此方法会被调用
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        log.debug("Executing Authentication logic...");
        JwtToken jwtToken = (JwtToken) token;
        String jwt = (String) jwtToken.getPrincipal();
        Claims claims = jwtUtil.getClaimsByToken(jwt);
        if (claims == null) {
            throw new AuthenticationException("Token is invalid, please login again.");
        }
        if (jwtUtil.isTokenExpired(claims)) {
            throw new ExpiredCredentialsException("Token is expired, please login again.");
        }
        String username = claims.getSubject();
        User user = userService.getOne(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<User>().eq("username", username));
        if (user == null) {
            throw new UnknownAccountException("User does not exist.");
        }
        // 创建我们的身份凭证对象
        AccountProfile profile = new AccountProfile();
        BeanUtils.copyProperties(user, profile);

        return new SimpleAuthenticationInfo(profile, jwt, getName());
    }
}
