package com.example.demo.services;

import com.example.demo.enums.email.Subject;
import com.example.demo.models.Travel;
import com.example.demo.models.TravelOffer;
import com.example.demo.models.User;
import com.example.demo.models.dtos.EmailRequest;
import com.example.demo.models.dtos.TravelDTO;
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
        travel.getOffers().add(travelOffer);

        saveOffer(travelOffer);
        this.travelRepository.save(travel);

        EmailRequest request = new EmailRequest(travelOffer.getTravel().getUser().getEmail(), Subject.OFFER_CREATED, travelOfferDto.getNote());
        this.emailService.sendEmail(request);

        return new ResponseEntity<>("Travel request processed successfully", HttpStatus.OK);

    }

    public Travel getTravel(Long id) {
        try {
            return travelRepository.getReferenceById(id);
        } catch (EntityNotFoundException e) {
        }
        return null;
    }

    public TravelOffer getOffer(Long id) {
        try {
            return offerRepository.getReferenceById(id);
        } catch (EntityNotFoundException e) {
        }
        return null;
    }

    public List<TravelDTO> getAll() {
        return travelRepository.findAll().stream()
                .map((travel -> new TravelDTO(travel)))
                .collect(Collectors.toList());
    }

    public List<TravelOfferDTO> getOffers(Long travelId, UserDetails userDetails) {
        Optional<Travel> travel = travelRepository.findById(travelId);
        if (travel.isEmpty() || !userDetails.getUsername().equals(travel.get().getUser().getUsername())) {
            return new ArrayList<>();
        }

        return travel.get().getOffers().stream()
                .map((offer -> new TravelOfferDTO(offer.getId(), offer.getNote())))
                .collect(Collectors.toList());
    }

    public void saveTravel(Travel travel) {
        this.travelRepository.save(travel);
    }
}
