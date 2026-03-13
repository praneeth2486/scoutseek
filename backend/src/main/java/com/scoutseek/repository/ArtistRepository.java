package com.scoutseek.repository;

import com.scoutseek.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Integer> {
    List<Artist> findByIsDeletedFalse();
    Optional<Artist> findByNameIgnoreCase(String name);
}
