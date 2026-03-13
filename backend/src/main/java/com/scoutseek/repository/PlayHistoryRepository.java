package com.scoutseek.repository;

import com.scoutseek.model.PlayHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayHistoryRepository extends JpaRepository<PlayHistory, Integer> {

    List<PlayHistory> findByUserUserIdOrderByPlayedAtDesc(Integer userId);

    long countByUserUserId(Integer userId);

    // Top songs by play count for a user
    @Query("SELECT ph.song.songId, ph.song.title, COUNT(ph) as playCount " +
           "FROM PlayHistory ph WHERE ph.user.userId = :userId " +
           "GROUP BY ph.song.songId, ph.song.title " +
           "ORDER BY playCount DESC")
    List<Object[]> findTopSongsByUser(@Param("userId") Integer userId);

    // Top artists by play count for a user
    @Query("SELECT a.artistId, a.name, COUNT(ph) as playCount " +
           "FROM PlayHistory ph " +
           "JOIN ph.song.artists a " +
           "WHERE ph.user.userId = :userId " +
           "GROUP BY a.artistId, a.name " +
           "ORDER BY playCount DESC")
    List<Object[]> findTopArtistsByUser(@Param("userId") Integer userId);

    // Top genres by play count for a user
    @Query("SELECT g.genreId, g.name, COUNT(ph) as playCount " +
           "FROM PlayHistory ph " +
           "JOIN ph.song.genres g " +
           "WHERE ph.user.userId = :userId " +
           "GROUP BY g.genreId, g.name " +
           "ORDER BY playCount DESC")
    List<Object[]> findTopGenresByUser(@Param("userId") Integer userId);

    // Global top songs
    @Query("SELECT ph.song.songId, ph.song.title, COUNT(ph) as playCount " +
           "FROM PlayHistory ph " +
           "GROUP BY ph.song.songId, ph.song.title " +
           "ORDER BY playCount DESC")
    List<Object[]> findGlobalTopSongs();

    // Global top artists
    @Query("SELECT a.artistId, a.name, COUNT(ph) as playCount " +
           "FROM PlayHistory ph " +
           "JOIN ph.song.artists a " +
           "GROUP BY a.artistId, a.name " +
           "ORDER BY playCount DESC")
    List<Object[]> findGlobalTopArtists();

    // Global top genres
    @Query("SELECT g.genreId, g.name, COUNT(ph) as playCount " +
           "FROM PlayHistory ph " +
           "JOIN ph.song.genres g " +
           "GROUP BY g.genreId, g.name " +
           "ORDER BY playCount DESC")
    List<Object[]> findGlobalTopGenres();
}
