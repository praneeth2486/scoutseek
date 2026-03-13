package com.scoutseek.service;

import com.scoutseek.dto.AnalyticsDTO;
import com.scoutseek.model.*;
import com.scoutseek.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(AnalyticsService.class);

    private final PlayHistoryRepository playHistoryRepository;
    private final UserRepository userRepository;
    private final SongRepository songRepository;

    public AnalyticsService(PlayHistoryRepository playHistoryRepository,
                            UserRepository userRepository, SongRepository songRepository) {
        this.playHistoryRepository = playHistoryRepository;
        this.userRepository = userRepository;
        this.songRepository = songRepository;
    }

    public void recordPlay(Integer userId, Integer songId, Integer listenedSeconds) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new RuntimeException("Song not found"));
        PlayHistory history = PlayHistory.builder()
                .user(user).song(song).listenedSeconds(listenedSeconds).build();
        playHistoryRepository.save(history);
        log.info("Play recorded: userId={} songId={}", userId, songId);
    }

    public AnalyticsDTO getUserAnalytics(Integer userId) {
        long totalPlays = playHistoryRepository.countByUserUserId(userId);
        return new AnalyticsDTO(
                totalPlays,
                toStatItems(playHistoryRepository.findTopSongsByUser(userId)),
                toStatItems(playHistoryRepository.findTopArtistsByUser(userId)),
                toStatItems(playHistoryRepository.findTopGenresByUser(userId))
        );
    }

    public AnalyticsDTO getGlobalAnalytics() {
        long totalPlays = playHistoryRepository.count();
        return new AnalyticsDTO(
                totalPlays,
                toStatItems(playHistoryRepository.findGlobalTopSongs()),
                toStatItems(playHistoryRepository.findGlobalTopArtists()),
                toStatItems(playHistoryRepository.findGlobalTopGenres())
        );
    }

    private List<AnalyticsDTO.StatItem> toStatItems(List<Object[]> raw) {
        return raw.stream()
                .limit(10)
                .map(row -> new AnalyticsDTO.StatItem(
                        row[0] != null ? ((Number) row[0]).intValue() : null,
                        (String) row[1],
                        row[2] != null ? ((Number) row[2]).longValue() : 0L
                ))
                .collect(Collectors.toList());
    }
}
