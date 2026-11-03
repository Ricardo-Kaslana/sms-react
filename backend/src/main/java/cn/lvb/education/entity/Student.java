package cn.lvb.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("t_student")
public class Student implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String studentNo;
    private String name;
    private String gender;
    private Integer classId;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
