package cn.lvb.education.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentVO {
    private Integer id;
    private String studentNo;
    private String name;
    private String gender;
    private Integer classId;

    // 关联字段
    private String className;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
