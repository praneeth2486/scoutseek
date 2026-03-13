package com.scoutseek.repository;

import com.scoutseek.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Integer> {
    List<Genre> findByIsDeletedFalse();
    Optional<Genre> findByNameIgnoreCase(String name);
}
