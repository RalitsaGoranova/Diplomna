package com.example.demo.enums.email;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Subject {
    OFFER_CREATED("A new travel offer has been submitted!"),
    OFFER_ACCEPTED("Your travel offer has been accepted!"),
    OFFER_DENIED("Your travel offer has been denied!"),
    TRAVEL_DELETED("Your travel has been canceled by the driver!"),
    OFFER_DELETED("A passenger has deleted their offer for travel");
    private final String message;
}
