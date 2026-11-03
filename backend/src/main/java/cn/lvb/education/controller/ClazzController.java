package cn.lvb.education.controller;

import cn.lvb.education.aspect.LogOperation;
import cn.lvb.education.entity.Clazz;
import cn.lvb.education.service.IClazzService;
import cn.lvb.education.vo.ApiResponse;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.authz.annotation.Logical;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/class")
public class ClazzController {

    @Autowired
    private IClazzService clazzService;

    /**
     * 新增班级
     */
    @PostMapping
    @RequiresRoles("ROLE_ADMIN") // 只有管理员可以新增班级
    @LogOperation("新增班级")
    public ApiResponse<Object> addClass(@RequestBody Clazz clazz) {
        // 校验班级名称是否已存在
        long count = clazzService.count(new QueryWrapper<Clazz>().eq("name", clazz.getName()));
        if (count > 0) {
            return ApiResponse.fail("班级名称已存在");
        }
        clazzService.save(clazz);
        return ApiResponse.success("新增成功");
    }

    /**
     * 删除班级
     */
    @DeleteMapping("/{id}")
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("删除班级")
    public ApiResponse<Object> deleteClass(@PathVariable Integer id) {
        // 注意：删除班级会通过外键级联删除 t_student 和 t_grade 表中的相关数据，操作需谨慎
        clazzService.removeById(id);
        return ApiResponse.success("删除成功");
    }

    /**
     * 修改班级
     */
    @PutMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("修改班级")
    public ApiResponse<Object> updateClass(@RequestBody Clazz clazz) {
        // 校验修改后的名称是否与其他班级冲突
        Clazz existing = clazzService.getOne(new QueryWrapper<Clazz>().eq("name", clazz.getName()));
        if (existing != null && !existing.getId().equals(clazz.getId())) {
            return ApiResponse.fail("班级名称已存在");
        }
        clazzService.updateById(clazz);
        return ApiResponse.success("修改成功");
    }

    /**
     * 分页查询班级列表
     */
    @GetMapping("/page")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<Page<Clazz>> getClassPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String name) { // 支持按名称模糊查询

        Page<Clazz> page = new Page<>(current, size);
        QueryWrapper<Clazz> queryWrapper = new QueryWrapper<>();
        // 如果查询条件 name 不为空，则添加模糊查询
        if (StringUtils.hasText(name)) {
            queryWrapper.like("name", name);
        }
        // 按创建时间倒序排列
        queryWrapper.orderByDesc("create_time");

        clazzService.page(page, queryWrapper);
        return ApiResponse.success(page);
    }

    /**
     * 查询所有班级列表（用于下拉框）
     */
    @GetMapping("/list")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR) // 枚举类 选择多个角色
    public ApiResponse<List<Clazz>> getAllClasses() {
        List<Clazz> list = clazzService.list(new QueryWrapper<Clazz>().orderByAsc("name"));
        return ApiResponse.success(list);
    }
}
