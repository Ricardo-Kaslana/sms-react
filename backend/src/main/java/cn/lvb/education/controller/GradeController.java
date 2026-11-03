package cn.lvb.education.controller;

import cn.lvb.education.aspect.LogOperation;
import cn.lvb.education.entity.Grade;
import cn.lvb.education.service.IGradeService;
import cn.lvb.education.vo.ApiResponse;
import cn.lvb.education.vo.GradeVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/grade")
public class GradeController {

    @Autowired
    private IGradeService gradeService;

    /**
     * 新增成绩
     */
    @PostMapping
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    @LogOperation("新增成绩")
    public ApiResponse<Object> addGrade(@RequestBody Grade grade) {
        // 检查该学生在该学期是否已有该科目的成绩
        long count = gradeService.count(new QueryWrapper<Grade>()
                .eq("student_id", grade.getStudentId())
                .eq("subject_id", grade.getSubjectId())
                .eq("term", grade.getTerm()));
        if (count > 0) {
            return ApiResponse.fail("该学生在该学期已录入此科目成绩，请勿重复添加");
        }
        gradeService.save(grade);
        return ApiResponse.success("新增成功");
    }

    /**
     * 删除成绩
     */
    @DeleteMapping("/{id}")
    @RequiresRoles("ROLE_ADMIN") // 只有管理员有权限删除成绩
    @LogOperation("删除成绩")
    public ApiResponse<Object> deleteGrade(@PathVariable Integer id) {
        gradeService.removeById(id);
        return ApiResponse.success("删除成功");
    }

    /**
     * 修改成绩
     */
    @PutMapping
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    @LogOperation("修改成绩")
    public ApiResponse<Object> updateGrade(@RequestBody Grade grade) {
        // 确保修改不会与其它记录冲突
        Grade existing = gradeService.getOne(new QueryWrapper<Grade>()
                .eq("student_id", grade.getStudentId())
                .eq("subject_id", grade.getSubjectId())
                .eq("term", grade.getTerm()));
        if (existing != null && !existing.getId().equals(grade.getId())) {
            return ApiResponse.fail("该学生在该学期已录入此科目成绩，无法修改");
        }
        gradeService.updateById(grade);
        return ApiResponse.success("修改成功");
    }

    /**
     * 分页查询成绩列表
     */
    @GetMapping("/page")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<Page<GradeVO>> getGradePage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            // 查询条件
            @RequestParam(required = false) String term,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) Integer subjectId,
            @RequestParam(required = false) Integer classId
    ) {
        Page<GradeVO> page = new Page<>(current, size);
        Page<GradeVO> resultPage = gradeService.getGradePage(page, term, studentName, subjectId, classId);
        return ApiResponse.success(resultPage);
    }

    /**
     * 获取所有不重复的学期列表
     */
    @GetMapping("/terms")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<List<String>> getTermList() {
        // 使用 QueryWrapper 查询不重复的 term 字段
        QueryWrapper<Grade> queryWrapper = new QueryWrapper<>();
        queryWrapper.select("DISTINCT term").orderByDesc("term"); // 按学期倒序
        List<Grade> gradeList = gradeService.list(queryWrapper);
        // 将结果从 List<Grade> 转换为 List<String>
        List<String> termList = gradeList.stream().map(Grade::getTerm).collect(Collectors.toList());
        return ApiResponse.success(termList);
    }
}
