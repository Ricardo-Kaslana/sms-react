package cn.lvb.education.security;
// 当用户通过JWT认证后，用一个对象来存放他们的核心信息（ID, 用户名, 角色等）。这个对象将作为Shiro的 Principal（身份）。

import lombok.Data;

import java.io.Serializable;

@Data
public class AccountProfile implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String username;
    private String role;
    private String fullNam;
    private String avatar;
}
