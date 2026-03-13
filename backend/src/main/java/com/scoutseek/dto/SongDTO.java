package com.scoutseek.dto;

import java.time.LocalDate;
import java.util.List;

public class SongDTO {
    private Integer songId;
    private String title;
    private Integer durationSeconds;
    private LocalDate releaseDate;
    private String filePath;
    private List<ArtistDTO> artists;
    private List<GenreDTO> genres;

    public SongDTO() {}

    public Integer getSongId() { return songId; }
    public String getTitle() { return title; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public String getFilePath() { return filePath; }
    public List<ArtistDTO> getArtists() { return artists; }
    public List<GenreDTO> getGenres() { return genres; }

    public void setSongId(Integer songId) { this.songId = songId; }
    public void setTitle(String title) { this.title = title; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setArtists(List<ArtistDTO> artists) { this.artists = artists; }
    public void setGenres(List<GenreDTO> genres) { this.genres = genres; }
}
