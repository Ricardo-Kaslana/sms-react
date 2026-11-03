package cn.lvb.education;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 生成 BCrypt 密码哈希的小工具。
 * 用法：运行 main 方法，可在参数中传入原始密码（默认 123456），
 * 将输出的哈希值替换到 t_user 表的 password 字段即可重置密码。
 */
public class PasswordEncodingTest {

    public static void main(String[] args) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        String rawPassword = args.length > 0 ? args[0] : "123456";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        System.out.println("原始密码: " + rawPassword);
        System.out.println("加密后的密码: " + encodedPassword);
        System.out.println("密码是否匹配: " + passwordEncoder.matches(rawPassword, encodedPassword));
    }
}
