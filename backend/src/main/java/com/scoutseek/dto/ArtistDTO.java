package com.scoutseek.dto;

public class ArtistDTO {
    private Integer artistId;
    private String name;

    public ArtistDTO() {}

    public ArtistDTO(Integer artistId, String name) {
        this.artistId = artistId;
        this.name = name;
    }

    public Integer getArtistId() { return artistId; }
    public String getName() { return name; }
    public void setArtistId(Integer artistId) { this.artistId = artistId; }
    public void setName(String name) { this.name = name; }
}
