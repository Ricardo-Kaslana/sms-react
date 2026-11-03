package cn.lvb.education.service.impl;

import cn.lvb.education.entity.Grade;
import cn.lvb.education.mapper.GradeMapper;
import cn.lvb.education.service.IGradeService;
import cn.lvb.education.vo.GradeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class GradeServiceImpl extends ServiceImpl<GradeMapper, Grade> implements IGradeService {

    @Override
    public Page<GradeVO> getGradePage(Page<GradeVO> page, String term, String studentName, Integer subjectId, Integer classId) {
        return this.baseMapper.findGradePage(page, term, studentName, subjectId, classId);
    }
}
