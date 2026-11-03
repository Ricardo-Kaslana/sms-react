package cn.lvb.education.vo;
// 统一响应格式
// 为了前后端交互方便，定义统一的返回结果类。

import lombok.Data;

import java.io.Serializable;

@Data
public class ApiResponse<T> implements Serializable {

    private int code;
    private String message;
    private T data;

    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 成功
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "操作成功", data);
    }

    public static <T> ApiResponse<T> success() {
        return success(null);
    }

    // 失败
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(500, message, null);
    }

    public static <T> ApiResponse<T> fail(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
