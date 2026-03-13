package com.scoutseek.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String username;
    private String role;
    private Integer userId;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String username, String role, Integer userId) {
        this.token = token;
        this.email = email;
        this.username = username;
        this.role = role;
        this.userId = userId;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getRole() { return role; }
    public Integer getUserId() { return userId; }
    public void setToken(String token) { this.token = token; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
    public void setRole(String role) { this.role = role; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
