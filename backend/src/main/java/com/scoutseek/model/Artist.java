package com.scoutseek.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "artist")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "artist_id")
    private Integer artistId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToMany(mappedBy = "artists")
    private Set<Song> songs = new HashSet<>();

    public Artist() {}

    // Getters
    public Integer getArtistId() { return artistId; }
    public String getName() { return name; }
    public Boolean getIsDeleted() { return isDeleted; }
    public Set<Song> getSongs() { return songs; }

    // Setters
    public void setArtistId(Integer artistId) { this.artistId = artistId; }
    public void setName(String name) { this.name = name; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public void setSongs(Set<Song> songs) { this.songs = songs; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer artistId;
        private String name;
        private Boolean isDeleted = false;

        public Builder artistId(Integer i) { this.artistId = i; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder isDeleted(Boolean d) { this.isDeleted = d; return this; }

        public Artist build() {
            Artist a = new Artist();
            a.artistId = this.artistId;
            a.name = this.name;
            a.isDeleted = this.isDeleted;
            return a;
        }
    }
}
