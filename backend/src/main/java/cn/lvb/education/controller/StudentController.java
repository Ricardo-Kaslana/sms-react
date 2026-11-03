package cn.lvb.education.controller;

import cn.lvb.education.aspect.LogOperation;
import cn.lvb.education.entity.Student;
import cn.lvb.education.service.IStudentService;
import cn.lvb.education.vo.ApiResponse;
import cn.lvb.education.vo.StudentVO;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private IStudentService studentService;

    /**
     * 新增学生
     */
    @PostMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("新增学生")
    public ApiResponse<Object> addStudent(@RequestBody Student student) {
        // 校验学号是否唯一
        long count = studentService.count(new QueryWrapper<Student>().eq("student_no", student.getStudentNo()));
        if (count > 0) {
            return ApiResponse.fail("学号已存在");
        }
        studentService.save(student);
        return ApiResponse.success("新增成功");
    }

    /**
     * 删除学生
     */
    @DeleteMapping("/{id}")
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("删除学生")
    public ApiResponse<Object> deleteStudent(@PathVariable Integer id) {
        studentService.removeById(id);
        return ApiResponse.success("删除成功");
    }

    /**
     * 修改学生
     */
    @PutMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("修改学生")
    public ApiResponse<Object> updateStudent(@RequestBody Student student) {
        // 校验修改后的学号是否与其他学生冲突
        Student existing = studentService.getOne(new QueryWrapper<Student>().eq("student_no", student.getStudentNo()));
        if (existing != null && !existing.getId().equals(student.getId())) {
            return ApiResponse.fail("学号已存在");
        }
        studentService.updateById(student);
        return ApiResponse.success("修改成功");
    }

    /**
     * 分页和条件查询学生列表
     */
    @GetMapping("/page")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<Page<StudentVO>> getStudentPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            // 查询条件
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String studentNo,
            @RequestParam(required = false) Integer classId
    ) {
        Page<StudentVO> page = new Page<>(current, size);
        Page<StudentVO> resultPage = studentService.getStudentPage(page, name, studentNo, classId);
        return ApiResponse.success(resultPage);
    }

    /**
     * 获取所有学生列表（用于下拉框）
     */
    @GetMapping("/list")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<List<Student>> getAllStudents() {
        return ApiResponse.success(studentService.list());
    }
}
