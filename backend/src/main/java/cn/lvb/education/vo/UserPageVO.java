package cn.lvb.education.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserPageVO {
    private Integer id;
    private String username;
    // 不返回密码
    private String role;
    private String fullName;
    private String avatar;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
