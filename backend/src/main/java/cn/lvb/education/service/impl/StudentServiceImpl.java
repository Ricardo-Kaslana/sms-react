package cn.lvb.education.service.impl;

import cn.lvb.education.entity.Student;
import cn.lvb.education.mapper.StudentMapper;
import cn.lvb.education.service.IStudentService;
import cn.lvb.education.vo.StudentVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentServiceImpl extends ServiceImpl<StudentMapper, Student> implements IStudentService {

    @Override
    public Page<StudentVO> getStudentPage(Page<StudentVO> page, String name, String studentNo, Integer classId) {
        // 直接调用Mapper中的自定义方法
        return this.baseMapper.findStudentPage(page, name, studentNo, classId);
    }
}
