package cn.lvb.education.service;

import cn.lvb.education.dto.LoginDTO;
import cn.lvb.education.dto.UpdatePasswordDTO;
import cn.lvb.education.dto.UserProfileDTO;
import cn.lvb.education.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface IUserService extends IService<User> {
    /**
     * 用户登录
     * @param loginDTO 登录信息
     * @return JWT
     */
    String login(LoginDTO loginDTO);

    /**
     * 上传并更新用户头像
     * @param userId 用户ID
     * @param file 上传的文件
     * @return 新头像的可访问URL
     */
    String uploadAvatar(Integer userId, MultipartFile file) throws IOException;

    // 用户登出
    void logout(String jwt);

    // 修改用户信息 密码
    void updateUserProfile(Integer userId, UserProfileDTO userProfileDTO);
    void updatePassword(Integer userId, UpdatePasswordDTO updatePasswordDTO);

    // 新增 用于用户管理页面
    Page<User> getUserPage(Page<User> page, String username, String role);
    void addUser(User user);
    void updateUser(User user);
    void deleteUser(Integer id);

}
