package com.roadsafe.mumbai.dto;

import java.time.LocalDateTime;

public class ApiResponse<T> {
    private boolean success = true;
    private String message;
    private T data;
    private MetaDto meta;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse() {}

    public ApiResponse(T data) {
        this.data = data;
    }

    public ApiResponse(T data, MetaDto meta) {
        this.data = data;
        this.meta = meta;
    }

    public ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Getters & Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public MetaDto getMeta() { return meta; }
    public void setMeta(MetaDto meta) { this.meta = meta; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
