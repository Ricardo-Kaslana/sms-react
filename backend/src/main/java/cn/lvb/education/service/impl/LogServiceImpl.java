package cn.lvb.education.service.impl;

import cn.lvb.education.entity.Log;
import cn.lvb.education.mapper.LogMapper;
import cn.lvb.education.service.ILogService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class LogServiceImpl extends ServiceImpl<LogMapper, Log> implements ILogService {
}
