package com.scoutseek.repository;

import com.scoutseek.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
    List<Playlist> findByUserUserIdAndIsDeletedFalse(Integer userId);
    Optional<Playlist> findByPlaylistIdAndIsDeletedFalse(Integer playlistId);
}
