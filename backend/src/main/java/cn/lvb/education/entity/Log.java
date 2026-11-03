package cn.lvb.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("t_log")
public class Log implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String operator;
    private String operation;
    private String ipAddress;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    // java.time.LocalDateTime 是Java 8+推荐的日期时间类型，MyBatis-Plus 3.x 对它的支持非常完善，可以避免很多时区和格式化问题
}
