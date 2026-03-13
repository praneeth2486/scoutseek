package com.scoutseek.controller;

import com.scoutseek.dto.*;
import com.scoutseek.service.SongService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SongDTO>>> getAllSongs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Songs fetched", songService.getAllSongs(page, size)));
    }

    @GetMapping("/{songId}")
    public ResponseEntity<ApiResponse<SongDTO>> getSong(@PathVariable Integer songId) {
        return ResponseEntity.ok(ApiResponse.success("Song fetched", songService.getSongById(songId)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<SongDTO>>> searchSongs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @RequestParam(required = false) List<Integer> artistIds,
            @RequestParam(required = false) List<Integer> genreIds,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Search results",
                songService.searchSongs(title, minDuration, maxDuration, artistIds, genreIds, page, size)));
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SongDTO>> uploadSong(
            @RequestParam String title,
            @RequestParam Integer durationSeconds,
            @RequestParam(required = false) String releaseDate,
            @RequestParam List<Integer> artistIds,
            @RequestParam List<Integer> genreIds,
            @RequestParam MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.success("Song uploaded",
                songService.uploadSong(title, durationSeconds, releaseDate, artistIds, genreIds, file)));
    }

    @DeleteMapping("/{songId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSong(@PathVariable Integer songId) {
        songService.deleteSong(songId);
        return ResponseEntity.ok(ApiResponse.success("Song deleted", null));
    }
}
