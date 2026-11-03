package cn.lvb.education.vo;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GradeVO {
    private Integer id;
    private Integer studentId;
    private Integer subjectId;
    private BigDecimal score;
    private String term;

    // 关联字段
    private String studentName;
    private String studentNo;
    private String subjectName;
    private String className; // 额外关联上班级名称，可能用于筛选

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
