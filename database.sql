-- ============================================
-- ScoutSeek Database Setup
-- Run this in MySQL Workbench or CLI
-- MySQL port: 3312, user: root
-- ============================================

CREATE DATABASE IF NOT EXISTS music_player_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE music_player_db;

-- USERS (with role column added for Spring Security)
CREATE TABLE IF NOT EXISTS users (
    user_id    INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    username   VARCHAR(100),
    role       ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- SONG
CREATE TABLE IF NOT EXISTS song (
    song_id          INT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(255) NOT NULL,
    duration_seconds INT NOT NULL,
    release_date     DATE,
    file_path        VARCHAR(500) NOT NULL,
    is_deleted       BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- ARTIST
CREATE TABLE IF NOT EXISTS artist (
    artist_id  INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- GENRE
CREATE TABLE IF NOT EXISTS genre (
    genre_id   INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB;

-- PLAYLIST
CREATE TABLE IF NOT EXISTS playlist (
    playlist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted  BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_playlist_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- PLAY HISTORY
CREATE TABLE IF NOT EXISTS play_history (
    history_id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    song_id          INT NOT NULL,
    played_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    listened_seconds INT,
    CONSTRAINT fk_history_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    CONSTRAINT fk_history_song FOREIGN KEY (song_id) REFERENCES song(song_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- SONG <-> ARTIST (M:N)
CREATE TABLE IF NOT EXISTS song_artist (
    song_id   INT NOT NULL,
    artist_id INT NOT NULL,
    PRIMARY KEY (song_id, artist_id),
    CONSTRAINT fk_song_artist_song   FOREIGN KEY (song_id)   REFERENCES song(song_id)     ON DELETE RESTRICT,
    CONSTRAINT fk_song_artist_artist FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- SONG <-> GENRE (M:N)
CREATE TABLE IF NOT EXISTS song_genre (
    song_id  INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (song_id, genre_id),
    CONSTRAINT fk_song_genre_song  FOREIGN KEY (song_id)  REFERENCES song(song_id)   ON DELETE RESTRICT,
    CONSTRAINT fk_song_genre_genre FOREIGN KEY (genre_id) REFERENCES genre(genre_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- PLAYLIST <-> SONG (M:N ordered)
CREATE TABLE IF NOT EXISTS playlist_song (
    playlist_id INT NOT NULL,
    song_id     INT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    PRIMARY KEY (playlist_id, song_id),
    CONSTRAINT fk_ps_playlist FOREIGN KEY (playlist_id) REFERENCES playlist(playlist_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ps_song     FOREIGN KEY (song_id)     REFERENCES song(song_id)         ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_song_is_deleted    ON song(is_deleted);
CREATE INDEX idx_song_duration      ON song(duration_seconds);
CREATE INDEX idx_artist_name        ON artist(name);
CREATE INDEX idx_genre_name         ON genre(name);
CREATE INDEX idx_song_artist_song   ON song_artist(song_id);
CREATE INDEX idx_song_artist_artist ON song_artist(artist_id);
CREATE INDEX idx_song_genre_song    ON song_genre(song_id);
CREATE INDEX idx_song_genre_genre   ON song_genre(genre_id);
CREATE INDEX idx_play_history_user  ON play_history(user_id);
CREATE INDEX idx_play_history_song  ON play_history(song_id);
CREATE INDEX idx_play_history_time  ON play_history(played_at);
CREATE INDEX idx_playlist_user      ON playlist(user_id);

-- ============================================
-- SEED: Create default ADMIN account
-- Email: admin@scoutseek.com  Password: admin123
-- (BCrypt hash of "admin123")
-- ============================================
INSERT IGNORE INTO users (email, password_hash, username, role)
VALUES ('admin@scoutseek.com',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWq',
        'Admin', 'ADMIN');
