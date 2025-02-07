package cn.funstack.foldericon.generator.exception;

/**
 * @FileName ApiError
 * @Description
 * @Author yifan
 * @date 2025-01-28 17:48
 **/
public enum ApiError {

    // 参数
    PARAM_ERROR(400, "参数错误"),
    PATH_NOT_EXIST(400, "路径不存在"),
    PATH_NOT_DIR(400, "路径不是目录"),
    SVG_READ_ERROR(400, "SVG读取错误"),
    IMAGE_COMPOSE_ERROR(400, "图片合成错误"),
    WRITE_IMAGE_ERROR(400, "写入图片错误"),
    SET_ICON_ERROR(400, "图标设置错误"),
    ICON_CAN_NOT_GET(400, "图标获取失败"),

    // 系统
    SYSTEM_ERROR(500, "服务器内部错误"),

    // 权限
    NOT_LOGIN(401, "未登录");

    // 枚举项的参数
    private final Integer code;
    private final String message;

    // 构造函数
    ApiError(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    // 获取枚举项的参数
    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
