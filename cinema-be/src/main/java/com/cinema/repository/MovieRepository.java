package com.cinema.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Movie;
import com.cinema.enums.EntityStatus;

@Repository
public interface MovieRepository extends JpaRepository<Movie, UUID>, JpaSpecificationExecutor<Movie> {

    Page<Movie> findByStatus(EntityStatus status, Pageable pageable);

    long countByStatus(EntityStatus status);

    @Query("SELECT m FROM Movie m WHERE m.showingStartDate <= :today AND m.showingEndDate >= :today AND m.status = 'ACTIVE'")
    Page<Movie> findNowShowing(@Param("today") LocalDate today, Pageable pageable);

    @Query("SELECT m FROM Movie m WHERE m.showingStartDate > :today AND m.status = 'COMING_SOON'")
    Page<Movie> findComingSoon(@Param("today") LocalDate today, Pageable pageable);

    @Query("SELECT m FROM Movie m JOIN m.genres g WHERE g.genreId IN :genreIds AND m.status IN :statuses GROUP BY m")
    Page<Movie> filterByGenres(@Param("genreIds") List<UUID> genreIds, @Param("statuses") List<EntityStatus> statuses, Pageable pageable);
}
