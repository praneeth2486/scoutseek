package com.scoutseek.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "play_history")
public class PlayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Integer historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "played_at")
    private LocalDateTime playedAt = LocalDateTime.now();

    @Column(name = "listened_seconds")
    private Integer listenedSeconds;

    public PlayHistory() {}

    // Getters
    public Integer getHistoryId() { return historyId; }
    public User getUser() { return user; }
    public Song getSong() { return song; }
    public LocalDateTime getPlayedAt() { return playedAt; }
    public Integer getListenedSeconds() { return listenedSeconds; }

    // Setters
    public void setHistoryId(Integer historyId) { this.historyId = historyId; }
    public void setUser(User user) { this.user = user; }
    public void setSong(Song song) { this.song = song; }
    public void setPlayedAt(LocalDateTime playedAt) { this.playedAt = playedAt; }
    public void setListenedSeconds(Integer listenedSeconds) { this.listenedSeconds = listenedSeconds; }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Integer historyId;
        private User user;
        private Song song;
        private LocalDateTime playedAt = LocalDateTime.now();
        private Integer listenedSeconds;

        public Builder historyId(Integer i) { this.historyId = i; return this; }
        public Builder user(User u) { this.user = u; return this; }
        public Builder song(Song s) { this.song = s; return this; }
        public Builder playedAt(LocalDateTime p) { this.playedAt = p; return this; }
        public Builder listenedSeconds(Integer l) { this.listenedSeconds = l; return this; }

        public PlayHistory build() {
            PlayHistory h = new PlayHistory();
            h.historyId = this.historyId;
            h.user = this.user;
            h.song = this.song;
            h.playedAt = this.playedAt;
            h.listenedSeconds = this.listenedSeconds;
            return h;
        }
    }
}
