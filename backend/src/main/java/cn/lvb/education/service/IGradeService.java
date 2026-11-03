package cn.lvb.education.service;

import cn.lvb.education.entity.Grade;
import cn.lvb.education.vo.GradeVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;

public interface IGradeService extends IService<Grade> {

    Page<GradeVO> getGradePage(Page<GradeVO> page, String term, String studentName, Integer subjectId, Integer classId);
}
