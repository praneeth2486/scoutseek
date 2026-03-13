package com.scoutseek.dto;

import java.util.List;

public class AnalyticsDTO {
    private long totalPlays;
    private List<StatItem> topSongs;
    private List<StatItem> topArtists;
    private List<StatItem> topGenres;

    public AnalyticsDTO() {}

    public AnalyticsDTO(long totalPlays, List<StatItem> topSongs,
                        List<StatItem> topArtists, List<StatItem> topGenres) {
        this.totalPlays = totalPlays;
        this.topSongs = topSongs;
        this.topArtists = topArtists;
        this.topGenres = topGenres;
    }

    public long getTotalPlays() { return totalPlays; }
    public List<StatItem> getTopSongs() { return topSongs; }
    public List<StatItem> getTopArtists() { return topArtists; }
    public List<StatItem> getTopGenres() { return topGenres; }
    public void setTotalPlays(long totalPlays) { this.totalPlays = totalPlays; }
    public void setTopSongs(List<StatItem> topSongs) { this.topSongs = topSongs; }
    public void setTopArtists(List<StatItem> topArtists) { this.topArtists = topArtists; }
    public void setTopGenres(List<StatItem> topGenres) { this.topGenres = topGenres; }

    public static class StatItem {
        private Integer id;
        private String name;
        private Long playCount;

        public StatItem() {}

        public StatItem(Integer id, String name, Long playCount) {
            this.id = id;
            this.name = name;
            this.playCount = playCount;
        }

        public Integer getId() { return id; }
        public String getName() { return name; }
        public Long getPlayCount() { return playCount; }
        public void setId(Integer id) { this.id = id; }
        public void setName(String name) { this.name = name; }
        public void setPlayCount(Long playCount) { this.playCount = playCount; }
    }
}
