package com.cinema.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Showtime;
import com.cinema.enums.EntityStatus;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, UUID> {

    Page<Showtime> findByStartTimeGreaterThanEqual(LocalDateTime dateTime, Pageable pageable);

    Page<Showtime> findByStartTimeGreaterThanEqualAndStatusNot(LocalDateTime dateTime, EntityStatus status, Pageable pageable);

    List<Showtime> findByMovieMovieIdAndStatusOrderByStartTimeAsc(UUID movieId, EntityStatus status);

    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie JOIN FETCH s.room WHERE s.movie.movieId = :movieId AND s.startTime >= :now AND s.status = 'ACTIVE' ORDER BY s.startTime")
    List<Showtime> findAvailableShowtimes(@Param("movieId") UUID movieId, @Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) > 0 FROM Showtime s WHERE s.room.roomId = :roomId AND s.status = 'ACTIVE' AND "
         + "((s.startTime BETWEEN :start AND :end) OR (s.endTime BETWEEN :start AND :end) OR "
         + "(:start BETWEEN s.startTime AND s.endTime))")
    boolean existsOverlappingShowtime(@Param("roomId") UUID roomId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT s FROM Showtime s WHERE s.room.roomId = :roomId AND s.status <> :excludedStatus AND "
         + "((s.startTime BETWEEN :start AND :end) OR (s.endTime BETWEEN :start AND :end) OR "
         + "(:start BETWEEN s.startTime AND s.endTime))")
    List<Showtime> findOverlappingShowtimes(@Param("roomId") UUID roomId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("excludedStatus") EntityStatus excludedStatus);

    @Query("SELECT s FROM Showtime s JOIN FETCH s.movie JOIN FETCH s.room WHERE s.status = 'ACTIVE' AND s.startTime >= :start AND s.startTime < :end ORDER BY s.movie.movieId, s.startTime")
    List<Showtime> findActiveShowtimesByDate(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT s FROM Showtime s WHERE s.showtimeId = :id AND s.status = 'ACTIVE'")
    Optional<Showtime> findActiveById(@Param("id") UUID showtimeId);

    boolean existsByRoomRoomIdAndStatus(UUID roomId, EntityStatus status);

    boolean existsByRoomRoomIdAndStatusAndStartTimeGreaterThanEqual(UUID roomId, EntityStatus status, LocalDateTime dateTime);

    boolean existsByRoomRoomId(UUID roomId);

    @Modifying
    @Query("DELETE FROM Showtime s WHERE s.room.roomId = :roomId")
    void deleteByRoomRoomId(@Param("roomId") UUID roomId);
}
