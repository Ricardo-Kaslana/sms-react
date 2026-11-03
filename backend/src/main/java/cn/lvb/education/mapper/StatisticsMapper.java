package cn.lvb.education.mapper;

import cn.lvb.education.vo.DashboardVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface StatisticsMapper {

    Long getStudentCount();
    Long getClassCount();
    Long getSubjectCount();
    Long getUserCount();

    /**
     * 获取及格率统计数据
     * @param term 学期
     * @param passScore 及格分数线
     * @return
     */
    List<DashboardVO.ChartDataItem> getPassRateStats(@Param("term") String term, @Param("passScore") double passScore);

    /**
     * 获取各科目平均分
     * @param term 学期
     * @return
     */
    List<DashboardVO.ChartDataItem> getAvgScoreBySubject(@Param("term") String term);

    /**
     * 获取成绩分数段分布
     * @param term 学期
     * @return
     */
    List<DashboardVO.ChartDataItem> getScoreDistribution(@Param("term") String term);
}
