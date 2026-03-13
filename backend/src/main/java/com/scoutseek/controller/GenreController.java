package com.scoutseek.controller;

import com.scoutseek.dto.*;
import com.scoutseek.model.Genre;
import com.scoutseek.repository.GenreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GenreDTO>>> getAllGenres() {
        List<GenreDTO> genres = genreRepository.findByIsDeletedFalse()
                .stream()
                .map(g -> new GenreDTO(g.getGenreId(), g.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Genres fetched", genres));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<GenreDTO>> createGenre(@RequestBody GenreDTO dto) {
        Genre genre = Genre.builder().name(dto.getName()).isDeleted(false).build();
        genre = genreRepository.save(genre);
        return ResponseEntity.ok(ApiResponse.success("Genre created",
                new GenreDTO(genre.getGenreId(), genre.getName())));
    }

    @DeleteMapping("/{genreId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(@PathVariable Integer genreId) {
        Genre genre = genreRepository.findById(genreId)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        genre.setIsDeleted(true);
        genreRepository.save(genre);
        return ResponseEntity.ok(ApiResponse.success("Genre deleted", null));
    }
}
