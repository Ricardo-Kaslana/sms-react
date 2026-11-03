package cn.lvb.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("t_user")
public class User implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String username;
    private String password;
    private String role;
    private String fullName;
    private String avatar;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
