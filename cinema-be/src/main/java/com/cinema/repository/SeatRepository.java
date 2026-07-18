package com.cinema.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Seat;
import com.cinema.enums.EntityStatus;

@Repository
public interface SeatRepository extends JpaRepository<Seat, UUID> {

    List<Seat> findByRoomRoomIdOrderByRowLabelAscSeatNumberAsc(UUID roomId);

    List<Seat> findByRoomRoomIdAndStatus(UUID roomId, EntityStatus status);

    @Query("SELECT s FROM Seat s WHERE s.room.roomId = :roomId AND s.status = 'ACTIVE' ORDER BY s.rowLabel, s.seatNumber")
    List<Seat> findActiveSeatsByRoom(@Param("roomId") UUID roomId);

    @Query("SELECT DISTINCT s.rowLabel, s.seatType.seatTypeId FROM Seat s WHERE s.room.roomId = :roomId AND s.status = 'ACTIVE'")
    List<Object[]> findDistinctRowSeatTypesByRoomId(@Param("roomId") UUID roomId);

    long countByRoomRoomId(UUID roomId);

    void deleteByRoomRoomId(UUID roomId);

    @Modifying
    @Query("DELETE FROM Seat s WHERE s.room.roomId = :roomId")
    void deleteSeatsByRoomId(@Param("roomId") UUID roomId);
}
