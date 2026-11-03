package cn.lvb.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_subject")
public class Subject implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private String name;
    private BigDecimal credits; // score 和 credits 这类精确数值，在Java中应使用 BigDecimal 类型，可以避免精度丢失问题。

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
