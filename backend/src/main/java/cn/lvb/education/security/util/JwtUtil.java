package cn.lvb.education.security.util;
//JWT工具类
//这是生成和校验JWT的核心。

import cn.lvb.education.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Slf4j
@Component
public class JwtUtil {

    @Autowired
    private JwtProperties jwtProperties;

    /**
     * 生成JWT
     * @param username 用户名
     * @return JWT字符串
     */
    public String generateToken(String username, String role) {
        Date nowDate = new Date();
        Date expireDate = new Date(nowDate.getTime() + jwtProperties.getExpire() * 1000);
        SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());

        return Jwts.builder()
                .setHeaderParam("typ", "JWT")
                .setSubject(username)
                // 添加角色信息
                .claim("role", role)
                .setIssuedAt(nowDate)
                .setExpiration(expireDate)
                .signWith(key)
                .compact();
    }

    /**
     * 解析JWT
     * @param token JWT字符串
     * @return Claims对象，包含payload信息
     */
    public Claims getClaimsByToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes());
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.debug("Validate token error: ", e);
            return null;
        }
    }

    /**
     * 判断Token是否过期
     * @param claims
     * @return true: 已过期, false: 未过期
     */
    public boolean isTokenExpired(Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    /**
     * 获取 token 的过期时间
     * @param token JWT字符串
     * @return 过期时间的 Date 对象
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimsByToken(token).getExpiration();
    }
}
