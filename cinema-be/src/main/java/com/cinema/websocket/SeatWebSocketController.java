package com.cinema.websocket;

import java.util.Map;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class SeatWebSocketController {

    @MessageMapping("/seat/{showtimeId}")
    @SendTo("/topic/seats/{showtimeId}")
    public Map<String, Object> seatUpdate(@DestinationVariable String showtimeId, Map<String, Object> message) {
        UUID.fromString(showtimeId);
        return message;
    }
}
