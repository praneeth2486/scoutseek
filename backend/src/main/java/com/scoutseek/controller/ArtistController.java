package com.scoutseek.controller;

import com.scoutseek.dto.*;
import com.scoutseek.model.Artist;
import com.scoutseek.repository.ArtistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/artists")
public class ArtistController {

    private final ArtistRepository artistRepository;

    public ArtistController(ArtistRepository artistRepository) {
        this.artistRepository = artistRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArtistDTO>>> getAllArtists() {
        List<ArtistDTO> artists = artistRepository.findByIsDeletedFalse()
                .stream()
                .map(a -> new ArtistDTO(a.getArtistId(), a.getName()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success("Artists fetched", artists));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ArtistDTO>> createArtist(@RequestBody ArtistDTO dto) {
        Artist artist = Artist.builder().name(dto.getName()).isDeleted(false).build();
        artist = artistRepository.save(artist);
        return ResponseEntity.ok(ApiResponse.success("Artist created",
                new ArtistDTO(artist.getArtistId(), artist.getName())));
    }

    @DeleteMapping("/{artistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteArtist(@PathVariable Integer artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException("Artist not found"));
        artist.setIsDeleted(true);
        artistRepository.save(artist);
        return ResponseEntity.ok(ApiResponse.success("Artist deleted", null));
    }
}
