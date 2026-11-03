package cn.lvb.education.controller;

import cn.lvb.education.aspect.LogOperation;
import cn.lvb.education.dto.LoginDTO;
import cn.lvb.education.dto.UpdatePasswordDTO;
import cn.lvb.education.dto.UserProfileDTO;
import cn.lvb.education.entity.User;
import cn.lvb.education.security.AccountProfile;
import cn.lvb.education.service.IUserService;
import cn.lvb.education.vo.ApiResponse;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.apache.shiro.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private IUserService userService;

    @PostMapping("/login")
    @LogOperation("用户登录")
    public ApiResponse<Map<String, String>> login(@RequestBody @Valid LoginDTO loginDTO) {
        String token = userService.login(loginDTO);

        Map<String, String> result = new HashMap<>();
        result.put("token", token);

        return ApiResponse.success(result);
    }

    /**
     * 获取当前登录用户的个人信息
     */
    @GetMapping("/profile")
    @RequiresAuthentication
    public ApiResponse<User> getUserProfile() {
        // 从Shiro中获取当前用户的完整身份信息
        AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
        // 根据ID从数据库查询最新的、完整的用户信息返回
        User user = userService.getById(profile.getId());
        // 安全起见，返回前将密码置空
        user.setPassword(null);
        return ApiResponse.success(user);
    }

    /**
     * 修改当前登录用户的基本信息
     */
    @PutMapping("/profile")
    @RequiresAuthentication
    @LogOperation("修改个人信息")
    public ApiResponse<Object> updateUserProfile(@RequestBody @Valid UserProfileDTO userProfileDTO) {
        AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
        userService.updateUserProfile(profile.getId(), userProfileDTO);
        return ApiResponse.success("信息更新成功");
    }

    /**
     * 修改当前登录用户的密码
     */
    @PutMapping("/password")
    @RequiresAuthentication
    @LogOperation("修改密码")
    public ApiResponse<Object> updatePassword(@RequestBody @Valid UpdatePasswordDTO updatePasswordDTO) {
        AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
        userService.updatePassword(profile.getId(), updatePasswordDTO);

        // 当前JWT仍然有效，直到过期。
        return ApiResponse.success("密码修改成功");
    }

    /**
     * 上传用户头像
     */
    @PostMapping("/avatar")
    @RequiresAuthentication
    @LogOperation("上传头像")
    public ApiResponse<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ApiResponse.fail("上传失败，请选择文件");
        }

        try {
            AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
            String newAvatarUrl = userService.uploadAvatar(profile.getId(), file);

            Map<String, String> result = new HashMap<>();
            result.put("avatarUrl", newAvatarUrl);

            return ApiResponse.success(result);
        } catch (IOException e) {
            log.error("文件上传失败", e);
            return ApiResponse.fail("文件上传失败，请稍后再试");
        }
    }

    @PostMapping("/logout")
    @RequiresAuthentication // 必须是登录状态才能登出
    @LogOperation("用户登出")
    public ApiResponse<Object> logout(@RequestHeader("Authorization") String jwt) {
        userService.logout(jwt);
        return ApiResponse.success("登出成功");
    }

    // 新增系列方法 用于用户管理页面

    @GetMapping("/page")
    @RequiresRoles("ROLE_ADMIN")
    public ApiResponse<Page<User>> getUserPage(
            @RequestParam(defaultValue = "1") long current,
            @RequestParam(defaultValue = "10") long size,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String role
    ) {
        Page<User> page = new Page<>(current, size);
        return ApiResponse.success(userService.getUserPage(page, username, role));
    }

    @PostMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("新增用户")
    public ApiResponse<Object> addUser(@RequestBody @Valid User user) {
        // 检查密码是否为空
        if (!StringUtils.hasText(user.getPassword())) {
            return ApiResponse.fail("初始密码不能为空");
        }

        // 使用MyBatis-Plus的selectCount方法检查用户是否存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, user.getUsername());
        if (userService.count(queryWrapper) > 0) {
            return ApiResponse.fail("用户名已存在");
        }

        userService.addUser(user);
        return ApiResponse.success("新增用户成功");
    }

    @PutMapping
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("修改用户")
    public ApiResponse<Object> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return ApiResponse.success("修改用户成功");
    }

    @DeleteMapping("/{id}")
    @RequiresRoles("ROLE_ADMIN")
    @LogOperation("删除用户")
    public ApiResponse<Object> deleteUser(@PathVariable Integer id) {
        // 禁止删除自己
        AccountProfile profile = (AccountProfile) SecurityUtils.getSubject().getPrincipal();
        if (profile.getId().equals(id)) {
            return ApiResponse.fail("不能删除自己");
        }
        userService.deleteUser(id);
        return ApiResponse.success("删除用户成功");
    }

}
