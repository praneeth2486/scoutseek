package com.scoutseek.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "song")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "song_id")
    private Integer songId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "song_artist",
        joinColumns = @JoinColumn(name = "song_id"),
        inverseJoinColumns = @JoinColumn(name = "artist_id")
    )
    private Set<Artist> artists = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "song_genre",
        joinColumns = @JoinColumn(name = "song_id"),
        inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    public Song() {}

    // Getters
    public Integer getSongId() { return songId; }
    public String getTitle() { return title; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public LocalDate getReleaseDate() { return releaseDate; }
    public String getFilePath() { return filePath; }
    public Boolean getIsDeleted() { return isDeleted; }
    public Set<Artist> getArtists() { return artists; }
    public Set<Genre> getGenres() { return genres; }

    // Setters
    public void setSongId(Integer songId) { this.songId = songId; }
    public void setTitle(String title) { this.title = title; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public void setReleaseDate(LocalDate releaseDate) { this.releaseDate = releaseDate; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public void setArtists(Set<Artist> artists) { this.artists = artists; }
    public void setGenres(Set<Genre> genres) { this.genres = genres; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer songId;
        private String title;
        private Integer durationSeconds;
        private LocalDate releaseDate;
        private String filePath;
        private Boolean isDeleted = false;
        private Set<Artist> artists = new HashSet<>();
        private Set<Genre> genres = new HashSet<>();

        public Builder songId(Integer i) { this.songId = i; return this; }
        public Builder title(String t) { this.title = t; return this; }
        public Builder durationSeconds(Integer d) { this.durationSeconds = d; return this; }
        public Builder releaseDate(LocalDate r) { this.releaseDate = r; return this; }
        public Builder filePath(String f) { this.filePath = f; return this; }
        public Builder isDeleted(Boolean d) { this.isDeleted = d; return this; }
        public Builder artists(Set<Artist> a) { this.artists = a; return this; }
        public Builder genres(Set<Genre> g) { this.genres = g; return this; }

        public Song build() {
            Song s = new Song();
            s.songId = this.songId;
            s.title = this.title;
            s.durationSeconds = this.durationSeconds;
            s.releaseDate = this.releaseDate;
            s.filePath = this.filePath;
            s.isDeleted = this.isDeleted;
            s.artists = this.artists;
            s.genres = this.genres;
            return s;
        }
    }
}
