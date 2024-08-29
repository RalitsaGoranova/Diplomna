package com.example.demo.models.dtos;

import com.example.demo.enums.status.OfferStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class TravelDTOPassengers {
    private Long travelId;
    private String startLocation;
    private String endLocation;
    private LocalDateTime startTime;
    private OfferStatus status;
    private String note;
}