package com.cinema.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TimeSlotResponse {

    private String time;
    private boolean available;
    private String conflictReason;
}
