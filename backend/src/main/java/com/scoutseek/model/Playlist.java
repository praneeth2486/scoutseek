package com.scoutseek.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "playlist")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "playlist_id")
    private Integer playlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "playlist_song",
        joinColumns = @JoinColumn(name = "playlist_id"),
        inverseJoinColumns = @JoinColumn(name = "song_id")
    )
    private List<Song> songs = new ArrayList<>();

    public Playlist() {}

    // Getters
    public Integer getPlaylistId() { return playlistId; }
    public User getUser() { return user; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Boolean getIsDeleted() { return isDeleted; }
    public List<Song> getSongs() { return songs; }

    // Setters
    public void setPlaylistId(Integer playlistId) { this.playlistId = playlistId; }
    public void setUser(User user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public void setSongs(List<Song> songs) { this.songs = songs; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer playlistId;
        private User user;
        private String name;
        private LocalDateTime createdAt = LocalDateTime.now();
        private Boolean isDeleted = false;
        private List<Song> songs = new ArrayList<>();

        public Builder playlistId(Integer i) { this.playlistId = i; return this; }
        public Builder user(User u) { this.user = u; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder createdAt(LocalDateTime c) { this.createdAt = c; return this; }
        public Builder isDeleted(Boolean d) { this.isDeleted = d; return this; }
        public Builder songs(List<Song> s) { this.songs = s; return this; }

        public Playlist build() {
            Playlist p = new Playlist();
            p.playlistId = this.playlistId;
            p.user = this.user;
            p.name = this.name;
            p.createdAt = this.createdAt;
            p.isDeleted = this.isDeleted;
            p.songs = this.songs;
            return p;
        }
    }
}
