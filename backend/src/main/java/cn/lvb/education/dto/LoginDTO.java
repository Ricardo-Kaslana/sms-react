package cn.lvb.education.dto;
// 创建登录数据传输对象 (DTO) 登陆时需要在请求体中加入这些字段

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class LoginDTO {
    @NotBlank(message = "用户名不能为空")
    private String username;

    @NotBlank(message = "密码不能为空")
    private String password;

    @NotBlank(message = "验证码key不能为空")
    private String captchaKey;

    @NotBlank(message = "验证码不能为空")
    private String captchaCode;
}
