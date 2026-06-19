package com.cinema.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cinema.entity.Room;
import com.cinema.enums.EntityStatus;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {

    List<Room> findByStatus(EntityStatus status);

    boolean existsByRoomName(String roomName);
}
