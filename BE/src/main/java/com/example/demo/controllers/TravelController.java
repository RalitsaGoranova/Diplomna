package com.example.demo.controllers;

import com.example.demo.enums.email.Subject;
import com.example.demo.enums.status.OfferStatus;
import com.example.demo.models.TravelOffer;
import com.example.demo.models.User;
import com.example.demo.models.dtos.EmailRequest;
import com.example.demo.models.dtos.TravelDTO;
import com.example.demo.models.dtos.TravelOfferDTO;
import com.example.demo.services.EmailService;
import com.example.demo.services.TravelService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    private final TravelService travelService;
    private final EmailService emailService;
    private final UserService userService;

    final static DateTimeFormatter CUSTOM_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Autowired
    public TravelController(TravelService travelService, EmailService emailService, UserService userService) {
        this.travelService = travelService;
        this.emailService = emailService;
        this.userService = userService;
    }

    @GetMapping
    @Secured({})
    public ResponseEntity<List<TravelDTO>> getAll() {
        return new ResponseEntity<>(travelService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Secured({})
    public ResponseEntity<List<TravelOfferDTO>> getOffers(@PathVariable Long travelId,
                                                          @AuthenticationPrincipal UserDetails userDetails) {
        return new ResponseEntity<>(travelService.getOffers(travelId, userDetails), HttpStatus.OK);
    }

    @PostMapping
    @Secured({})
    public ResponseEntity<String> submitTravel(@RequestBody TravelDTO travel,
                                               @AuthenticationPrincipal UserDetails userDetails) {
        travelService.saveTravel(travel, userDetails);
        return new ResponseEntity<>("Travel created", HttpStatus.CREATED);
    }

    @PostMapping("/offer/{travelId}")
    @Secured({})
    public ResponseEntity<String> addTravelOffer(@PathVariable Long travelId,
                                                 @RequestBody TravelOfferDTO travelOffer,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        return travelService.addOffer(travelId, travelOffer, userDetails);
    }

    @GetMapping("/offer/{travelId}/accept")
    @Secured({})
    public ResponseEntity<String> acceptRequest(@PathVariable Long travelId,
                                                @AuthenticationPrincipal UserDetails userDetails) {
        TravelOffer offer = travelService.getOffer(travelId);
        if (offer == null) {
            return new ResponseEntity<>("Travel not found", HttpStatus.NOT_FOUND);
        }

        if (offer.getStatus() != OfferStatus.SUBMITTED) {
            return new ResponseEntity<>("Offer already completed", HttpStatus.NOT_FOUND);
        }

        User user = userService.getByUsername(userDetails.getUsername());
        if (user == null || offer.getTravel().getUser().getId() != user.getId()) {
            return new ResponseEntity<>("User does not access to this travel", HttpStatus.NOT_FOUND);
        }

        EmailRequest request = new EmailRequest(offer.getUser().getEmail(), Subject.OFFER_ACCEPTED,
                String.format("Your offer for the travel %s - %s (%s) has been accepted! Please call % on %s!",
                        offer.getTravel().getStartLocation(),
                        offer.getTravel().getEndLocation(),
                        offer.getTravel().getStartTime().format(CUSTOM_FORMATTER),
                        offer.getTravel().getUser().getUsername(),
                        offer.getTravel().getUser().getPhoneNumber()));
        this.emailService.sendEmail(request);

        offer.setStatus(OfferStatus.ACCEPTED);

        this.travelService.saveOffer(offer);

        return new ResponseEntity<>("Travel request accepted successfully", HttpStatus.OK);
    }

    @GetMapping("/offer/{travelId}/decline")
    @Secured({})
    public ResponseEntity<String> declineRequest(@PathVariable Long travelId,
                                                 @AuthenticationPrincipal UserDetails userDetails) {

        TravelOffer offer = travelService.getOffer(travelId);
        if (offer == null) {
            return new ResponseEntity<>("Travel not found", HttpStatus.NOT_FOUND);
        }

        if (offer.getStatus() != OfferStatus.SUBMITTED) {
            return new ResponseEntity<>("Offer already completed", HttpStatus.NOT_FOUND);
        }

        User user = userService.getByUsername(userDetails.getUsername());
        if (user == null || offer.getTravel().getUser().getId() != user.getId()) {
            return new ResponseEntity<>("User does not access to this travel", HttpStatus.NOT_FOUND);
        }

        EmailRequest request = new EmailRequest(offer.getUser().getEmail(), Subject.OFFER_DENIED,
                String.format("Your offer for the travel %s - %s (%s) from %s has been declined!",
                        offer.getTravel().getStartLocation(),
                        offer.getTravel().getEndLocation(),
                        offer.getTravel().getStartTime().format(CUSTOM_FORMATTER),
                        offer.getTravel().getUser().getUsername()));
        this.emailService.sendEmail(request);

        offer.setStatus(OfferStatus.DENIED);

        this.travelService.saveOffer(offer);

        return new ResponseEntity<>("Travel request denied successfully", HttpStatus.OK);
    }
}
