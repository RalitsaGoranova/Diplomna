package com.example.demo.models;

import com.example.demo.models.dtos.TravelDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "travel")
public class Travel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "start_location", nullable = false)
    private String startLocation;

    @Column(name = "end_location", nullable = false)
    private String endLocation;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "free_spaces", nullable = false)
    private Integer freeSpaces;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Setter(AccessLevel.NONE)
    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<TravelOffer> offers = new ArrayList<>();

    public Travel(TravelDTO travelDTO, User user) {
        this.startLocation = travelDTO.getStartLocation();
        this.endLocation = travelDTO.getEndLocation();
        this.startTime = travelDTO.getStartTime();
        this.description = travelDTO.getDescription();
        this.freeSpaces = travelDTO.getFreeSpaces();
        this.user = user;
    }
}

