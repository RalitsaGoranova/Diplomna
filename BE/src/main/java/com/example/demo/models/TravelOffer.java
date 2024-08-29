package com.example.demo.models;

import com.example.demo.enums.status.OfferStatus;
import com.example.demo.models.dtos.TravelOfferDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "travel_offer")
public class TravelOffer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "note")
    private String note;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "travel_id")
    private Travel travel;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OfferStatus status = OfferStatus.SUBMITTED;

    public TravelOffer(TravelOfferDTO travelOffer, Travel travel, User user) {
        this.user = user;
        this.note = travelOffer.getNote();
        this.travel = travel;
    }

}



