package cn.lvb.education.controller;

import cn.lvb.education.vo.ApiResponse;
import com.wf.captcha.SpecCaptcha;
import com.wf.captcha.base.Captcha;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.io.ByteArrayOutputStream;

@RestController
public class CaptchaController {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping("/captcha")
    public ApiResponse<Map<String, String>> captcha() throws Exception {
        // 创建验证码对象
        Captcha captcha = new SpecCaptcha(130, 48, 5);
        captcha.setCharType(Captcha.TYPE_DEFAULT); // 使用默认的数字+字母

        // 生成唯一的key
        String key = UUID.randomUUID().toString().replace("-", "");

        // 获取验证码的文本内容并存入Redis，有效期2分钟
        String text = captcha.text().toLowerCase();
        redisTemplate.opsForValue().set(key, text, 2, TimeUnit.MINUTES);

        // 获取Base64编码的图片
        // 使用 getEncoder().encodeToString(...) 获取纯净的Base64字符串 而不是使用 captcha.toBase64()
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        captcha.out(outputStream);
        String imageBase64 = java.util.Base64.getEncoder().encodeToString(outputStream.toByteArray());

        // 返回key和图片给前端
        Map<String, String> result = new HashMap<>();
        result.put("key", key);
        result.put("image", imageBase64);

        return ApiResponse.success(result);
    }
}
