package com.scoutseek.service;

import com.scoutseek.dto.*;
import com.scoutseek.model.*;
import com.scoutseek.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SongService {

    private static final Logger log = LoggerFactory.getLogger(SongService.class);

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final GenreRepository genreRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public SongService(SongRepository songRepository, ArtistRepository artistRepository,
                       GenreRepository genreRepository) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.genreRepository = genreRepository;
    }

    public SongDTO uploadSong(String title, Integer durationSeconds, String releaseDate,
                              List<Integer> artistIds, List<Integer> genreIds,
                              MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Deduplicate IDs before fetching
        List<Integer> uniqueArtistIds = artistIds.stream().distinct().collect(Collectors.toList());
        List<Integer> uniqueGenreIds  = genreIds.stream().distinct().collect(Collectors.toList());

        Set<Artist> artists = new HashSet<>(artistRepository.findAllById(uniqueArtistIds));
        Set<Genre>  genres  = new HashSet<>(genreRepository.findAllById(uniqueGenreIds));

        Song song = Song.builder()
                .title(title)
                .durationSeconds(durationSeconds)
                .releaseDate(releaseDate != null ? LocalDate.parse(releaseDate) : null)
                .filePath("/uploads/" + filename)
                .artists(artists)
                .genres(genres)
                .isDeleted(false)
                .build();

        song = songRepository.save(song);
        log.info("Song uploaded: {}", song.getTitle());
        return toDTO(song);
    }

    public Page<SongDTO> getAllSongs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("songId").descending());
        return songRepository.findAllActive(pageable).map(this::toDTO);
    }

    public Page<SongDTO> searchSongs(String title, Integer minDuration, Integer maxDuration,
                                      List<Integer> artistIds, List<Integer> genreIds,
                                      int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return songRepository.searchSongs(title, minDuration, maxDuration, artistIds, genreIds, pageable)
                .map(this::toDTO);
    }

    public void deleteSong(Integer songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        song.setIsDeleted(true);
        songRepository.save(song);
        log.info("Song deleted: {}", songId);
    }

    public SongDTO getSongById(Integer songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        return toDTO(song);
    }

    public SongDTO toDTO(Song song) {
        SongDTO dto = new SongDTO();
        dto.setSongId(song.getSongId());
        dto.setTitle(song.getTitle());
        dto.setDurationSeconds(song.getDurationSeconds());
        dto.setReleaseDate(song.getReleaseDate());
        dto.setFilePath(song.getFilePath());

        // Use LinkedHashMap to deduplicate by ID while preserving order
        dto.setArtists(song.getArtists().stream()
                .collect(Collectors.toMap(
                        Artist::getArtistId,
                        a -> new ArtistDTO(a.getArtistId(), a.getName()),
                        (a, b) -> a,
                        LinkedHashMap::new))
                .values().stream()
                .collect(Collectors.toList()));

        dto.setGenres(song.getGenres().stream()
                .collect(Collectors.toMap(
                        Genre::getGenreId,
                        g -> new GenreDTO(g.getGenreId(), g.getName()),
                        (a, b) -> a,
                        LinkedHashMap::new))
                .values().stream()
                .collect(Collectors.toList()));

        return dto;
    }
}