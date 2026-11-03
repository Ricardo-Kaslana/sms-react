package cn.lvb.education.mapper;

import cn.lvb.education.entity.Grade;
import cn.lvb.education.vo.GradeVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface GradeMapper extends BaseMapper<Grade> {

    /**
     * 分页关联查询成绩信息
     * @param page 分页对象
     * @param term 学期 (精确查询)
     * @param studentName 学生姓名 (模糊查询)
     * @param subjectId 科目ID (精确查询)
     * @param classId 班级ID (精确查询)
     * @return
     */
    @Select("<script>" +
            "SELECT g.*, s.name AS student_name, s.student_no, sub.name AS subject_name, c.name as class_name " +
            "FROM t_grade g " +
            "LEFT JOIN t_student s ON g.student_id = s.id " +
            "LEFT JOIN t_subject sub ON g.subject_id = sub.id " +
            "LEFT JOIN t_class c ON s.class_id = c.id " +
            "<where> " +
            "  <if test='term != null and term != \"\"'>AND g.term = #{term}</if> " +
            "  <if test='studentName != null and studentName != \"\"'>AND s.name LIKE CONCAT('%', #{studentName}, '%')</if> " +
            "  <if test='subjectId != null'>AND g.subject_id = #{subjectId}</if> " +
            "  <if test='classId != null'>AND s.class_id = #{classId}</if> " +
            "</where> " +
            "ORDER BY g.create_time DESC" +
            "</script>")
    Page<GradeVO> findGradePage(Page<GradeVO> page,
                                @Param("term") String term,
                                @Param("studentName") String studentName,
                                @Param("subjectId") Integer subjectId,
                                @Param("classId") Integer classId);
}
