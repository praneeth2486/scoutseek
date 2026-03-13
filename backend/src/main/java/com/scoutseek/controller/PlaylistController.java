package com.scoutseek.controller;

import com.scoutseek.dto.*;
import com.scoutseek.model.User;
import com.scoutseek.repository.UserRepository;
import com.scoutseek.service.PlaylistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final UserRepository userRepository;

    public PlaylistController(PlaylistService playlistService, UserRepository userRepository) {
        this.playlistService = playlistService;
        this.userRepository = userRepository;
    }

    private Integer getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlaylistDTO>> createPlaylist(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Playlist created",
                playlistService.createPlaylist(body.get("name"), getUserId(userDetails))));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlaylistDTO>>> getMyPlaylists(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Playlists fetched",
                playlistService.getUserPlaylists(getUserId(userDetails))));
    }

    @GetMapping("/{playlistId}")
    public ResponseEntity<ApiResponse<PlaylistDTO>> getPlaylist(@PathVariable Integer playlistId) {
        return ResponseEntity.ok(ApiResponse.success("Playlist fetched",
                playlistService.getPlaylist(playlistId)));
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<ApiResponse<PlaylistDTO>> addSong(
            @PathVariable Integer playlistId, @PathVariable Integer songId) {
        return ResponseEntity.ok(ApiResponse.success("Song added",
                playlistService.addSong(playlistId, songId)));
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<ApiResponse<PlaylistDTO>> removeSong(
            @PathVariable Integer playlistId, @PathVariable Integer songId) {
        return ResponseEntity.ok(ApiResponse.success("Song removed",
                playlistService.removeSong(playlistId, songId)));
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<ApiResponse<Void>> deletePlaylist(@PathVariable Integer playlistId) {
        playlistService.deletePlaylist(playlistId);
        return ResponseEntity.ok(ApiResponse.success("Playlist deleted", null));
    }
}
