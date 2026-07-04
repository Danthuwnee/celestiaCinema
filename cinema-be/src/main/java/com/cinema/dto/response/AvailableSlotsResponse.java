package com.cinema.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AvailableSlotsResponse {

    private String date;
    private int movieDuration;
    private String roomName;
    private String movieTitle;
    private List<TimeSlotResponse> slots;
}
