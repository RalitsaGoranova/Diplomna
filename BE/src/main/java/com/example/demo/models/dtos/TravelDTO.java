package com.example.demo.models.dtos;

import com.example.demo.models.Travel;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TravelDTO {
    private Long id;
    private Long creatorId;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private String description;
    private Integer freeSpaces;

    public TravelDTO(Travel travel) {
        this.id = travel.getId();
        this.creatorId = travel.getUser().getId();
        this.startLocation = travel.getStartLocation();
        this.endLocation = travel.getEndLocation();
        this.description = travel.getDescription();
        this.startTime = travel.getStartTime();
        this.freeSpaces = travel.getFreeSpaces();
    }
}
