package cn.lvb.education.mapper;

import cn.lvb.education.entity.Student;
import cn.lvb.education.vo.StudentVO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface StudentMapper extends BaseMapper<Student> {

    /**
     * 分页关联查询学生信息和班级名称
     * @param page 分页对象
     * @param name 学生姓名 (模糊查询)
     * @param studentNo 学号 (模糊查询)
     * @param classId 班级ID (精确查询)
     * @return
     */
    @Select("SELECT s.*, c.name AS class_name " +
            "FROM t_student s " +
            "LEFT JOIN t_class c ON s.class_id = c.id " +
            "WHERE " +
            "  (#{name} IS NULL OR s.name LIKE CONCAT('%', #{name}, '%')) " +
            "  AND (#{studentNo} IS NULL OR s.student_no LIKE CONCAT('%', #{studentNo}, '%')) " +
            "  AND (#{classId} IS NULL OR s.class_id = #{classId}) " +
            "ORDER BY s.create_time DESC")
    Page<StudentVO> findStudentPage(Page<StudentVO> page,
                                    @Param("name") String name,
                                    @Param("studentNo") String studentNo,
                                    @Param("classId") Integer classId);
}
