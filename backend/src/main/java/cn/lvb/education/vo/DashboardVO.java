package cn.lvb.education.vo;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DashboardVO {

    // 顶部面板数据
    private PanelData panelData;

    // 饼图或柱状图的通用数据项
    @Data
    public static class ChartDataItem {
        private String name; // 名称，如 "及格人数" 或 "大学物理"
        private Object value; // 值，如 80 或 85.5
    }

    // 成绩及格率数据 (用于饼图)
    private List<ChartDataItem> passRateData;

    // 各科目平均分数据 (用于柱状图)
    private List<ChartDataItem> avgScoreBySubject;

    // 成绩分数段分布数据 (用于柱状图)
    private List<ChartDataItem> scoreDistribution;

    // 面板数据内部类
    @Data
    public static class PanelData {
        private long studentCount;
        private long classCount;
        private long subjectCount;
        private long userCount;
    }
}
