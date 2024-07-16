package com.example.demo.services;

import com.example.demo.config.JwtUtils;
import com.example.demo.models.User;
import com.example.demo.models.UserData;
import com.example.demo.models.dtos.AuthRequestLogin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;
    PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticationService(AuthenticationManager authenticationManager, JwtUtils jwtUtils, UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.getByUsername(username);
        return user == null ? null : new UserData(user);
    }

    public String authenticate(AuthRequestLogin authRequest) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(
                            authRequest.getUsername(), authRequest.getPassword()));
            System.out.println(authRequest.getUsername() +" / "+ authRequest.getPassword());
            if (authentication.isAuthenticated()) {
                return jwtUtils.generateToken(authRequest.getUsername());
            }
        } catch (Exception e) {
            // Log the exception for debugging
            System.out.println("Authentication failed: " + e.getMessage());
        }
        throw new UsernameNotFoundException("Invalid username or password!");
    }

}
