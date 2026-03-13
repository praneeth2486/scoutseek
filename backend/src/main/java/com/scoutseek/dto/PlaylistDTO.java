package com.scoutseek.dto;

import java.time.LocalDateTime;
import java.util.List;

public class PlaylistDTO {
    private Integer playlistId;
    private String name;
    private LocalDateTime createdAt;
    private List<SongDTO> songs;
    private Integer userId;

    public PlaylistDTO() {}

    public Integer getPlaylistId() { return playlistId; }
    public String getName() { return name; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<SongDTO> getSongs() { return songs; }
    public Integer getUserId() { return userId; }

    public void setPlaylistId(Integer playlistId) { this.playlistId = playlistId; }
    public void setName(String name) { this.name = name; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setSongs(List<SongDTO> songs) { this.songs = songs; }
    public void setUserId(Integer userId) { this.userId = userId; }
}
