package cn.lvb.education.service.impl;

import cn.lvb.education.entity.Subject;
import cn.lvb.education.mapper.SubjectMapper;
import cn.lvb.education.service.ISubjectService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class SubjectServiceImpl extends ServiceImpl<SubjectMapper, Subject> implements ISubjectService {
}
