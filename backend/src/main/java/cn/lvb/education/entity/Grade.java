package cn.lvb.education.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_grade")
public class Grade implements Serializable {
    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer studentId;
    private Integer subjectId;
    private BigDecimal score;
    private String term;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
