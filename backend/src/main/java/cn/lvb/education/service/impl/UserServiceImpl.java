package cn.lvb.education.service.impl;

import cn.lvb.education.dto.LoginDTO;
import cn.lvb.education.dto.UpdatePasswordDTO;
import cn.lvb.education.dto.UserProfileDTO;
import cn.lvb.education.entity.User;
import cn.lvb.education.mapper.UserMapper;
import cn.lvb.education.security.util.JwtUtil;
import cn.lvb.education.service.IUserService;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.concurrent.TimeUnit;

import java.io.File;
import java.io.IOException;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements IUserService {

    private static final Set<String> ALLOWED_AVATAR_EXTENSIONS =
            Set.of(".png", ".jpg", ".jpeg", ".gif", ".webp");

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    // 注入 PasswordEncoder
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.access-path}")
    private String accessPath;

    @Override
    public String login(LoginDTO loginDTO) {
        // 校验验证码
        String redisCode = redisTemplate.opsForValue().get(loginDTO.getCaptchaKey());
        if (!StringUtils.hasText(redisCode) || !redisCode.equalsIgnoreCase(loginDTO.getCaptchaCode())) {
            // 抛出具体的异常
            throw new IllegalArgumentException("验证码错误或已过期");
        }
        // 验证成功后，立即删除Redis中的验证码，防止重复使用
        redisTemplate.delete(loginDTO.getCaptchaKey());

        // 根据用户名查询用户
        User user = this.getOne(new QueryWrapper<User>().eq("username", loginDTO.getUsername()));
        if (user == null) {
            // 抛出具体的异常
            throw new IllegalArgumentException("用户名或密码错误");
        }

        // 校验密码
        // 使用 passwordEncoder.matches() 方法
        // 第一个参数是前端传来的原始密码
        // 第二个参数是数据库中存储的加密后的哈希值
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("用户名或密码错误");
        }

        // 密码校验成功，生成JWT
        return jwtUtil.generateToken(user.getUsername(), user.getRole());
    }

    @Override
    public void logout(String jwt) {
        Claims claims = jwtUtil.getClaimsByToken(jwt);
        if (claims != null) {
            Date expiration = claims.getExpiration();
            long remainingMillis = expiration.getTime() - System.currentTimeMillis();
            if (remainingMillis > 0) {
                // 将 token 存入 Redis 黑名单，过期时间为 token 剩余的有效时间
                redisTemplate.opsForValue().set("jwt_blacklist:" + jwt, "1", remainingMillis, TimeUnit.MILLISECONDS);
            }
        }
    }

    @Override
    public void updateUserProfile(Integer userId, UserProfileDTO userProfileDTO) {
        User user = new User();
        user.setId(userId);
        user.setFullName(userProfileDTO.getFullName());

        // 使用 updateById 只更新传入的非空字段
        this.updateById(user);
    }

    @Override
    public void updatePassword(Integer userId, UpdatePasswordDTO updatePasswordDTO) {
        // 根据userId获取用户信息
        User user = this.getById(userId);
        if (user == null) {
            // 理论上不会发生，因为userId是从token解析的
            throw new IllegalArgumentException("用户不存在");
        }

        // 验证旧密码是否正确
        if (!passwordEncoder.matches(updatePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("旧密码不正确");
        }

        // 将新密码加密
        String newEncodedPassword = passwordEncoder.encode(updatePasswordDTO.getNewPassword());

        // 更新数据库中的密码
        // 使用 UpdateWrapper 可以更精确地只更新 password 字段
        this.update(new UpdateWrapper<User>()
                .eq("id", userId)
                .set("password", newEncodedPassword));
    }

    @Override
    public String uploadAvatar(Integer userId, MultipartFile file) throws IOException {
        // 基础校验
        if (file.isEmpty()) {
            throw new IllegalArgumentException("上传的文件不能为空");
        }

        // 限制头像文件类型，避免上传可执行脚本等危险文件
        String originalFilename = file.getOriginalFilename();
        if (!StringUtils.hasText(originalFilename) || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("文件名不合法");
        }
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase(Locale.ROOT);
        if (!ALLOWED_AVATAR_EXTENSIONS.contains(fileExtension)) {
            throw new IllegalArgumentException("仅支持 png、jpg、jpeg、gif、webp 格式的图片");
        }

        // 生成唯一文件名，防止覆盖
        String newFileName = UUID.randomUUID().toString().replace("-", "") + fileExtension;

        // 创建上传目录（如果不存在）
        File uploadPath = new File(uploadDir);
        if (!uploadPath.exists()) {
            uploadPath.mkdirs();
        }

        // 创建目标文件
        File destFile = new File(uploadPath, newFileName);

        // 保存文件到磁盘（使用绝对路径，避免 Servlet 容器将相对路径解析到临时目录）
        file.transferTo(destFile.getAbsoluteFile());

        // 生成可访问的URL
        String avatarUrl = accessPath + newFileName;

        // 更新数据库
        User user = new User();
        user.setId(userId);
        user.setAvatar(avatarUrl);
        this.updateById(user);

        // 返回新的头像URL给前端
        return avatarUrl;
    }

    // 新增 用于用户管理页面
    @Override
    public Page<User> getUserPage(Page<User> page, String username, String role) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        if (StringUtils.hasText(username)) {
            queryWrapper.like("username", username);
        }
        if (StringUtils.hasText(role)) {
            queryWrapper.eq("role", role);
        }
        queryWrapper.orderByDesc("create_time");
        // 返回前密码置空
        Page<User> resultPage = this.page(page, queryWrapper);
        resultPage.getRecords().forEach(user -> user.setPassword(null));
        return resultPage;
    }

    @Override
    public void addUser(User user) {
        // 校验用户名
        long count = this.count(new QueryWrapper<User>().eq("username", user.getUsername()));
        if (count > 0) {
            throw new IllegalArgumentException("用户名已存在");
        }
        // 加密初始密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        this.save(user);
    }

    @Override
    public void updateUser(User user) {
        // 更新时不修改密码和用户名
        user.setPassword(null);
        user.setUsername(null);
        this.updateById(user);
    }

    @Override
    public void deleteUser(Integer id) {
        // 可以在这里加逻辑，比如禁止删除ID为1的超级管理员
        this.removeById(id);
    }

}
