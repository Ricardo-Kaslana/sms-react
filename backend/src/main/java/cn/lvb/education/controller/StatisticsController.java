package cn.lvb.education.controller;

import cn.lvb.education.service.IStatisticsService;
import cn.lvb.education.vo.ApiResponse;
import cn.lvb.education.vo.DashboardVO;
import org.apache.shiro.authz.annotation.Logical;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private IStatisticsService statisticsService;

    /**
     * 获取仪表盘统计数据
     * @param term 学期，例如 "2023-2024第一学期"。如果为空，则只返回面板数据。
     * @return
     */
    @GetMapping("/dashboard")
    @RequiresRoles(value = {"ROLE_ADMIN", "ROLE_TEACHER"}, logical = Logical.OR)
    public ApiResponse<DashboardVO> getDashboardData(@RequestParam(required = false) String term) {
        DashboardVO data = statisticsService.getDashboardData(term);
        return ApiResponse.success(data);
    }
}
