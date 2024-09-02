package com.example.demo.services;

import com.example.demo.enums.email.Subject;
import com.example.demo.enums.status.OfferStatus;
import com.example.demo.models.Travel;
import com.example.demo.models.TravelOffer;
import com.example.demo.models.User;
import com.example.demo.models.dtos.EmailRequest;
import com.example.demo.models.dtos.TravelDTO;
import com.example.demo.models.dtos.TravelDTOPassengers;
import com.example.demo.models.dtos.TravelOfferDTO;
import com.example.demo.repos.TravelOfferRepository;
import com.example.demo.repos.TravelRepository;
import com.example.demo.repos.UserRepository;
import io.jsonwebtoken.JwtException;
import jakarta.persistence.EntityNotFoundException;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TravelService {

    private final TravelRepository travelRepository;
    private final TravelOfferRepository offerRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;

    @Autowired
    public TravelService(TravelRepository travelRepository, TravelOfferRepository offerRepository, EmailService emailService, UserRepository userRepository) {
        this.travelRepository = travelRepository;
        this.offerRepository = offerRepository;
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    @SneakyThrows
    public void saveTravel(TravelDTO travel, UserDetails userDetails) {
        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
        if (user.isEmpty()) {
            throw new JwtException("User not found");
        }
        this.saveTravel(new Travel(travel, user.get()));
    }

    public void saveOffer(TravelOffer offer) {
        this.offerRepository.save(offer);
    }

    public ResponseEntity<String> addOffer(Long travelId, TravelOfferDTO travelOfferDto, UserDetails userDetails) {
        Travel travel = travelRepository.findById(travelId).orElse(null);
        if (travel == null) {
            return new ResponseEntity<>("Travel not found", HttpStatus.NOT_FOUND);
        }

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
        if (user.isEmpty()) {
            throw new JwtException("User not found");
        }

        TravelOffer travelOffer = new TravelOffer(travelOfferDto, travel, user.get());
        travelOffer.setStatus(OfferStatus.SUBMITTED);
        travel.getOffers().add(travelOffer);
        travel.setFreeSpaces(travel.getFreeSpaces() - 1);

        saveOffer(travelOffer);
        this.travelRepository.save(travel);

        EmailRequest request = new EmailRequest(travelOffer.getTravel().getUser().getEmail(), Subject.OFFER_CREATED,
                String.format("This is the note from the passenger: %s .You can email or call the passenger to tell you how much luggage they have , the exact location and what price you would offer them on the following details: %s / %s. Then approve or decline the offer by My profile.",
                       travelOffer.getNote(),
                        travelOffer.getUser().getEmail(),
                        travelOffer.getUser().getPhoneNumber()));
        this.emailService.sendEmail(request);

        return new ResponseEntity<>("Travel request processed successfully", HttpStatus.OK);

    }


    public TravelOffer getOffer(Long id) {
        try {
            return offerRepository.getReferenceById(id);
        } catch (EntityNotFoundException e) {
        }
        return null;
    }

    public List<TravelDTO> getAll() {
        LocalDateTime now = LocalDateTime.now();
        return travelRepository.findAll().stream()
                .filter(travel -> travel.getStartTime().isAfter(now))
                .map(TravelDTO::new)
                .collect(Collectors.toList());
    }

    public List<TravelOfferDTO> getOffers(Long travelId, UserDetails userDetails) {
        Optional<Travel> travel = travelRepository.findById(travelId);
        if (travel.isEmpty() || !userDetails.getUsername().equals(travel.get().getUser().getUsername())) {
            return new ArrayList<>();
        }

        return travel.get().getOffers().stream()
                .filter(offer -> offer.getStatus() == OfferStatus.SUBMITTED)
                .map((offer -> new TravelOfferDTO(offer.getId(), offer.getNote())))
                .collect(Collectors.toList());
    }

    public List<TravelDTOPassengers> getOffersPassenger(UserDetails userDetails) {
        List<Travel> travels = travelRepository.findAll();
        List<TravelDTOPassengers> passengerOffers = new ArrayList<>();
        for (Travel travel : travels) {
            if (travel.getStartTime().isAfter(LocalDateTime.now())){
                List<TravelOffer> offers = travel.getOffers().stream()
                        .filter(offer -> offer.getUser().getUsername().equals(userDetails.getUsername()))
                        .toList();

            for (TravelOffer offer : offers) {
                passengerOffers.add(new TravelDTOPassengers(
                        offer.getId(),
                        travel.getId(),
                        travel.getStartLocation(),
                        travel.getEndLocation(),
                        travel.getStartTime(),
                        offer.getStatus(),
                        offer.getNote()
                ));
            }
        }
        }
        return passengerOffers;
    }

    public void saveTravel(Travel travel) {
        this.travelRepository.save(travel);
    }

    public List<TravelDTO> getTravelsByCreatorId(Long creatorId) {
        return travelRepository.findAll().stream()  // Fetch all travels
                .filter(travel -> travel.getUser().getId().equals(creatorId))
                .filter(travel -> travel.getStartTime().isAfter(LocalDateTime.now()))
                .map(TravelDTO::new)
                .collect(Collectors.toList());
    }

    public boolean hasUserSubmittedOffer(Long travelId, Long userId) {
        return offerRepository.existsByTravelIdAndUserId(travelId, userId) || offerRepository.ifDriver(travelId, userId);
    }

    public ResponseEntity<String> deleteTravel(Long travelId, UserDetails userDetails) {
        Travel travel = travelRepository.findById(travelId).orElse(null);
        if (travel == null || !travel.getUser().getUsername().equals(userDetails.getUsername())) {
            return new ResponseEntity<>("Travel not found or user unauthorized", HttpStatus.NOT_FOUND);
        }

        List<TravelOffer> acceptedOffers = travel.getOffers().stream()
                .filter(offer -> offer.getStatus() == OfferStatus.ACCEPTED)
                .toList();

        // Изпращане на имейл до пътниците
        for (TravelOffer offer : acceptedOffers) {
            EmailRequest request = new EmailRequest(offer.getUser().getEmail(), Subject.TRAVEL_DELETED,
                    String.format("The travel %s - %s (%s) has been deleted.",
                            travel.getStartLocation(), travel.getEndLocation(), travel.getStartTime()));
            this.emailService.sendEmail(request);
        }
        travelRepository.delete(travel);

        return new ResponseEntity<>("Travel deleted successfully", HttpStatus.OK);
    }
    public ResponseEntity<String> deleteOffer(Long offerId, UserDetails userDetails) {
        TravelOffer offer = offerRepository.findById(offerId).orElse(null);
        if (offer == null || !offer.getUser().getUsername().equals(userDetails.getUsername())) {
            return new ResponseEntity<>("Offer not found or user unauthorized", HttpStatus.NOT_FOUND);
        }

        // Изпращане на имейл до шофьора
        EmailRequest request = new EmailRequest(offer.getTravel().getUser().getEmail(), Subject.OFFER_DELETED,
                String.format("A passenger has deleted their offer for travel %s - %s (%s).",
                        offer.getTravel().getStartLocation(), offer.getTravel().getEndLocation(), offer.getTravel().getStartTime()));
        this.emailService.sendEmail(request);
        Travel travel = offer.getTravel();
        travel.setFreeSpaces(travel.getFreeSpaces() + 1);
        travelRepository.save(travel);
        // Изтриване на офертата
        offerRepository.delete(offer);

        return new ResponseEntity<>("Offer deleted successfully", HttpStatus.OK);
    }
}