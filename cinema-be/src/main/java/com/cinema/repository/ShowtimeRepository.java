package com.cinema.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Showtime;
import com.cinema.enums.EntityStatus;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, UUID> {

    List<Showtime> findByMovieMovieIdAndStatusOrderByStartTimeAsc(UUID movieId, EntityStatus status);

    @Query("SELECT s FROM Showtime s WHERE s.movie.movieId = :movieId AND s.startTime >= :now AND s.status = 'ACTIVE' ORDER BY s.startTime")
    List<Showtime> findAvailableShowtimes(@Param("movieId") UUID movieId, @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) > 0 FROM Showtime s WHERE s.room.roomId = :roomId AND s.status = 'ACTIVE' AND "
         + "((s.startTime BETWEEN :start AND :end) OR (s.endTime BETWEEN :start AND :end) OR "
         + "(:start BETWEEN s.startTime AND s.endTime))")
    boolean existsOverlappingShowtime(@Param("roomId") UUID roomId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT s FROM Showtime s WHERE s.showtimeId = :id AND s.status = 'ACTIVE'")
    Optional<Showtime> findActiveById(@Param("id") UUID showtimeId);
}
