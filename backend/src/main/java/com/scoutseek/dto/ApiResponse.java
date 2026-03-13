package com.scoutseek.dto;

public class ApiResponse<T> {
    private String status;
    private String message;
    private T data;

    public ApiResponse() {}

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        ApiResponse<T> r = new ApiResponse<>();
        r.status = "success";
        r.message = message;
        r.data = data;
        return r;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.status = "error";
        r.message = message;
        r.data = null;
        return r;
    }

    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public T getData() { return data; }
    public void setStatus(String status) { this.status = status; }
    public void setMessage(String message) { this.message = message; }
    public void setData(T data) { this.data = data; }
}
