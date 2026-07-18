package com.cinema.dto.response;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class RoomResponse {

    private UUID roomId;
    private String roomName;
    private Integer totalRows;
    private Integer totalColumns;
    private String aisleAfterColumns;
    private String status;
}
