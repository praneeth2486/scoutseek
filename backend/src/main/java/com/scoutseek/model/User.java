package com.scoutseek.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.USER;

    @Column(name = "username", length = 100)
    private String username;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    public enum Role { USER, ADMIN }

    public User() {}

    // Getters
    public Integer getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Role getRole() { return role; }
    public String getUsername() { return username; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Boolean getIsDeleted() { return isDeleted; }

    // Setters
    public void setUserId(Integer userId) { this.userId = userId; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setRole(Role role) { this.role = role; }
    public void setUsername(String username) { this.username = username; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer userId;
        private String email;
        private String passwordHash;
        private Role role = Role.USER;
        private String username;
        private LocalDateTime createdAt = LocalDateTime.now();
        private Boolean isDeleted = false;

        public Builder userId(Integer u) { this.userId = u; return this; }
        public Builder email(String e) { this.email = e; return this; }
        public Builder passwordHash(String p) { this.passwordHash = p; return this; }
        public Builder role(Role r) { this.role = r; return this; }
        public Builder username(String u) { this.username = u; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public Builder isDeleted(Boolean d) { this.isDeleted = d; return this; }

        public User build() {
            User u = new User();
            u.userId = this.userId;
            u.email = this.email;
            u.passwordHash = this.passwordHash;
            u.role = this.role;
            u.username = this.username;
            u.createdAt = this.createdAt;
            u.isDeleted = this.isDeleted;
            return u;
        }
    }
}
