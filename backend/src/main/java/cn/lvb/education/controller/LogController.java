package cn.lvb.education.controller;

import cn.lvb.education.entity.Log;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import cn.lvb.education.service.ILogService;
import cn.lvb.education.vo.ApiResponse;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/log")
@RequiresRoles("ROLE_ADMIN") // 只有管理员可以查看日志
public class LogController {

    @Autowired
    private ILogService logService;

    /**
     * 分页查询日志
     */
    @GetMapping("/page")
    public ApiResponse<Page<Log>> getLogPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String operation
    ) {
        Page<Log> page = new Page<>(current, size);
        QueryWrapper<Log> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(operator)) {
            queryWrapper.like("operator", operator);
        }
        if (StringUtils.hasText(operation)) {
            queryWrapper.like("operation", operation);
        }
        queryWrapper.orderByDesc("create_time");

        logService.page(page, queryWrapper);
        return ApiResponse.success(page);
    }

    /**
     * 导出日志 (不分页)
     */
    @GetMapping("/export")
    public ApiResponse<List<Log>> exportLogs(
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String operation
    ) {
        QueryWrapper<Log> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(operator)) {
            queryWrapper.like("operator", operator);
        }
        if (StringUtils.hasText(operation)) {
            queryWrapper.like("operation", operation);
        }
        queryWrapper.orderByDesc("create_time");

        List<Log> list = logService.list(queryWrapper);
        return ApiResponse.success(list);
    }
}
