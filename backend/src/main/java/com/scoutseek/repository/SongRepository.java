package com.scoutseek.repository;

import com.scoutseek.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRepository extends JpaRepository<Song, Integer> {

    @Query("SELECT DISTINCT s FROM Song s " +
           "LEFT JOIN s.artists a " +
           "LEFT JOIN s.genres g " +
           "WHERE s.isDeleted = false " +
           "AND (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:minDuration IS NULL OR s.durationSeconds >= :minDuration) " +
           "AND (:maxDuration IS NULL OR s.durationSeconds <= :maxDuration) " +
           "AND (:artistIds IS NULL OR a.artistId IN :artistIds) " +
           "AND (:genreIds IS NULL OR g.genreId IN :genreIds)")
    Page<Song> searchSongs(
        @Param("title") String title,
        @Param("minDuration") Integer minDuration,
        @Param("maxDuration") Integer maxDuration,
        @Param("artistIds") List<Integer> artistIds,
        @Param("genreIds") List<Integer> genreIds,
        Pageable pageable
    );

    @Query("SELECT s FROM Song s WHERE s.isDeleted = false")
    Page<Song> findAllActive(Pageable pageable);
}
