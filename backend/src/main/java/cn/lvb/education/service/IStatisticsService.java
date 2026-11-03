package cn.lvb.education.service;

import cn.lvb.education.vo.DashboardVO;

public interface IStatisticsService {
    DashboardVO getDashboardData(String term);
}
