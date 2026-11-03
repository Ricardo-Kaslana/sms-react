package cn.lvb.education.service;

import cn.lvb.education.entity.Student;
import cn.lvb.education.vo.StudentVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IStudentService extends IService<Student> {

    /**
     * 分页查询学生（包含班级信息）
     */
    Page<StudentVO> getStudentPage(Page<StudentVO> page, String name, String studentNo, Integer classId);
}
