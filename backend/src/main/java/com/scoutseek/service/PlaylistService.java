package com.scoutseek.service;

import com.scoutseek.dto.*;
import com.scoutseek.model.*;
import com.scoutseek.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;
    private final SongService songService;

    public PlaylistService(PlaylistRepository playlistRepository, UserRepository userRepository,
                           SongRepository songRepository, SongService songService) {
        this.playlistRepository = playlistRepository;
        this.userRepository = userRepository;
        this.songRepository = songRepository;
        this.songService = songService;
    }

    public PlaylistDTO createPlaylist(String name, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Playlist playlist = Playlist.builder()
                .name(name).user(user).isDeleted(false).build();
        playlist = playlistRepository.save(playlist);
        return toDTO(playlist);
    }

    public List<PlaylistDTO> getUserPlaylists(Integer userId) {
        return playlistRepository.findByUserUserIdAndIsDeletedFalse(userId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PlaylistDTO getPlaylist(Integer playlistId) {
        Playlist playlist = playlistRepository.findByPlaylistIdAndIsDeletedFalse(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        return toDTO(playlist);
    }

    public PlaylistDTO addSong(Integer playlistId, Integer songId) {
        Playlist playlist = playlistRepository.findByPlaylistIdAndIsDeletedFalse(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        if (!playlist.getSongs().contains(song)) {
            playlist.getSongs().add(song);
            playlistRepository.save(playlist);
        }
        return toDTO(playlist);
    }

    public PlaylistDTO removeSong(Integer playlistId, Integer songId) {
        Playlist playlist = playlistRepository.findByPlaylistIdAndIsDeletedFalse(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        playlist.getSongs().removeIf(s -> s.getSongId().equals(songId));
        playlistRepository.save(playlist);
        return toDTO(playlist);
    }

    public void deletePlaylist(Integer playlistId) {
        Playlist playlist = playlistRepository.findByPlaylistIdAndIsDeletedFalse(playlistId)
                .orElseThrow(() -> new RuntimeException("Playlist not found"));
        playlist.setIsDeleted(true);
        playlistRepository.save(playlist);
    }

    private PlaylistDTO toDTO(Playlist playlist) {
        PlaylistDTO dto = new PlaylistDTO();
        dto.setPlaylistId(playlist.getPlaylistId());
        dto.setName(playlist.getName());
        dto.setCreatedAt(playlist.getCreatedAt());
        dto.setUserId(playlist.getUser().getUserId());
        dto.setSongs(playlist.getSongs().stream()
                .map(songService::toDTO).collect(Collectors.toList()));
        return dto;
    }
}
