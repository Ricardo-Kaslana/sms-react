package cn.lvb.education.controller;

import cn.lvb.education.aspect.LogOperation;
import cn.lvb.education.entity.Subject;
import cn.lvb.education.service.ISubjectService;
import cn.lvb.education.vo.ApiResponse;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subject")
public class SubjectController {

    @Autowired
    private ISubjectService subjectService;

    /**
     * 新增科目
     */
    @PostMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("新增科目")
    public ApiResponse<Object> addSubject(@RequestBody Subject subject) {
        // 校验科目名称是否唯一
        long count = subjectService.count(new QueryWrapper<Subject>().eq("name", subject.getName()));
        if (count > 0) {
            return ApiResponse.fail("科目名称已存在");
        }
        subjectService.save(subject);
        return ApiResponse.success("新增成功");
    }

    /**
     * 删除科目
     */
    @DeleteMapping("/{id}")
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("删除科目")
    public ApiResponse<Object> deleteSubject(@PathVariable Integer id) {
        subjectService.removeById(id);
        return ApiResponse.success("删除成功");
    }

    /**
     * 修改科目
     */
    @PutMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("修改科目")
    public ApiResponse<Object> updateSubject(@RequestBody Subject subject) {
        // 校验修改后的名称是否与其他科目冲突
        Subject existing = subjectService.getOne(new QueryWrapper<Subject>().eq("name", subject.getName()));
        if (existing != null && !existing.getId().equals(subject.getId())) {
            return ApiResponse.fail("科目名称已存在");
        }
        subjectService.updateById(subject);
        return ApiResponse.success("修改成功");
    }

    /**
     * 分页查询科目列表
     */
    @GetMapping("/page")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<Page<Subject>> getSubjectPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String name) { // 支持按名称模糊查询

        Page<Subject> page = new Page<>(current, size);
        QueryWrapper<Subject> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(name)) {
            queryWrapper.like("name", name);
        }
        queryWrapper.orderByDesc("create_time");

        subjectService.page(page, queryWrapper);
        return ApiResponse.success(page);
    }

    /**
     * 查询所有科目列表（用于下拉框）
     */
    @GetMapping("/list")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<List<Subject>> getAllSubjects() {
        List<Subject> list = subjectService.list(new QueryWrapper<Subject>().orderByAsc("name"));
        return ApiResponse.success(list);
    }
}
