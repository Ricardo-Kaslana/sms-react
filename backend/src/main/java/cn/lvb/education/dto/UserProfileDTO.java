package cn.lvb.education.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class UserProfileDTO {
    @NotBlank(message = "真实姓名不能为空")
    private String fullName;
}
