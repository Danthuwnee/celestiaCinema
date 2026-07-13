package com.cinema.dto.request;

import java.util.Map;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRoomRequest {
    private String roomName;
    private Integer totalRows;
    private Integer totalColumns;
    private String aisleAfterColumns;
    private String status;
    private Map<String, UUID> rowSeatTypes;
}
