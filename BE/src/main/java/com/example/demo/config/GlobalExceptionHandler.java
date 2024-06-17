package com.example.demo.config;

import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.io.DecodingException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.persistence.PersistenceException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleDatabaseException(DataAccessException ex) {
        return new ResponseEntity<>("An error occurred.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({PersistenceException.class, DataIntegrityViolationException.class})
    public ResponseEntity<String> handlePersistenceException(PersistenceException ex) {
        return new ResponseEntity<>("An error occurred. Check your request and try again.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({SignatureException.class, ClaimJwtException.class, JwtException.class, DecodingException.class, AuthenticationException.class, ExpiredJwtException.class})
    public ResponseEntity<String> handle(Exception e) {
        return new ResponseEntity<>("An authorization error occurred, check your request and try again.", HttpStatus.UNAUTHORIZED);
    }

}