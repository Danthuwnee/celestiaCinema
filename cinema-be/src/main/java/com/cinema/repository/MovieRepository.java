package com.cinema.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Movie;
import com.cinema.enums.EntityStatus;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID> {

    Page<Movie> findByStatus(EntityStatus status, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE m.showingStartDate <= :today AND m.showingEndDate >= :today AND m.status = 'ACTIVE'")
    List<Movie> findNowShowing(@Param("today") LocalDate today);

    @Query("SELECT m FROM Movie m WHERE m.showingStartDate > :today AND m.status = 'COMING_SOON'")
    List<Movie> findComingSoon(@Param("today") LocalDate today);

    @Query("SELECT m FROM Movie m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) AND m.status IN :statuses")
    Page<Movie> searchByTitle(@Param("keyword") String keyword, @Param("statuses") List<EntityStatus> statuses, Pageable pageable);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.genreId IN :genreIds AND m.status IN :statuses GROUP BY m")
    Page<Movie> filterByGenres(@Param("genreIds") List<UUID> genreIds, @Param("statuses") List<EntityStatus> statuses, Pageable pageable);
}
