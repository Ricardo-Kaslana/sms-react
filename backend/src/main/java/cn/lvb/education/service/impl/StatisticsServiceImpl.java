package cn.lvb.education.service.impl;

import cn.lvb.education.mapper.StatisticsMapper;
import cn.lvb.education.service.IStatisticsService;
import cn.lvb.education.vo.DashboardVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsServiceImpl implements IStatisticsService {

    @Autowired
    private StatisticsMapper statisticsMapper;

    private static final double PASS_SCORE = 60.0;

    @Override
    public DashboardVO getDashboardData(String term) {
        DashboardVO dashboardVO = new DashboardVO();

        // 组装面板数据
        DashboardVO.PanelData panelData = new DashboardVO.PanelData();
        panelData.setStudentCount(statisticsMapper.getStudentCount());
        panelData.setClassCount(statisticsMapper.getClassCount());
        panelData.setSubjectCount(statisticsMapper.getSubjectCount());
        panelData.setUserCount(statisticsMapper.getUserCount());
        dashboardVO.setPanelData(panelData);

        // 组装图表数据 (如果学期为空，则不查询图表数据)
        if (term != null && !term.isEmpty()) {
            dashboardVO.setPassRateData(statisticsMapper.getPassRateStats(term, PASS_SCORE));
            dashboardVO.setAvgScoreBySubject(statisticsMapper.getAvgScoreBySubject(term));
            dashboardVO.setScoreDistribution(statisticsMapper.getScoreDistribution(term));
        }

        return dashboardVO;
    }
}
