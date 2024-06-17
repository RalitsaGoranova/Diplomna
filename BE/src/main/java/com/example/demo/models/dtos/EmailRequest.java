package com.example.demo.models.dtos;

import com.example.demo.enums.email.Subject;
import lombok.Data;

@Data
public class EmailRequest {

    private final String recipientEmail;
    private final Subject subject;
    private final String message;
}
