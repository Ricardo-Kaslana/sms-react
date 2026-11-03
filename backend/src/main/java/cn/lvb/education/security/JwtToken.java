// 创建自定义JWT令牌 JwtToken
// Shiro的 login 方法需要一个 AuthenticationToken。我们创建一个自定义的实现，用于包装从请求中获取的JWT字符串。

package cn.lvb.education.security;

import org.apache.shiro.authc.AuthenticationToken;

public class JwtToken implements AuthenticationToken {

    private final String token;

    public JwtToken(String token) {
        this.token = token;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return token;
    }
}
