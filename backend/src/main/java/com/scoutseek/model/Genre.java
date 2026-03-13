package com.scoutseek.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "genre")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genre_id")
    private Integer genreId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    @ManyToMany(mappedBy = "genres")
    private Set<Song> songs = new HashSet<>();

    public Genre() {}

    // Getters
    public Integer getGenreId() { return genreId; }
    public String getName() { return name; }
    public Boolean getIsDeleted() { return isDeleted; }
    public Set<Song> getSongs() { return songs; }

    // Setters
    public void setGenreId(Integer genreId) { this.genreId = genreId; }
    public void setName(String name) { this.name = name; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }
    public void setSongs(Set<Song> songs) { this.songs = songs; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer genreId;
        private String name;
        private Boolean isDeleted = false;

        public Builder genreId(Integer i) { this.genreId = i; return this; }
        public Builder name(String n) { this.name = n; return this; }
        public Builder isDeleted(Boolean d) { this.isDeleted = d; return this; }

        public Genre build() {
            Genre g = new Genre();
            g.genreId = this.genreId;
            g.name = this.name;
            g.isDeleted = this.isDeleted;
            return g;
        }
    }
}
