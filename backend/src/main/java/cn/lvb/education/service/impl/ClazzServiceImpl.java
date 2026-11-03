package cn.lvb.education.service.impl;

import cn.lvb.education.entity.Clazz;
import cn.lvb.education.mapper.ClazzMapper;
import cn.lvb.education.service.IClazzService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class ClazzServiceImpl extends ServiceImpl<ClazzMapper, Clazz> implements IClazzService {
}
