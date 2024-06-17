package com.example.demo.services;

import com.example.demo.enums.UserRole;
import com.example.demo.models.User;
import com.example.demo.models.UserData;
import com.example.demo.models.dtos.AuthRequest;
import com.example.demo.repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User getByUsernameAndPassword(String username, String password) {
        User user = getByUsername(username);
        if (BCrypt.checkpw(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public User getByUsername(String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = getByUsername(username);
        return user == null ? null : new UserData(user);
    }

    public void save(User user) {
        userRepository.save(user);
    }

    public boolean usernameNotAvailable(String username) {
        return getByUsername(username) != null;
    }

    public void addUser(AuthRequest authRequest) {
        if (usernameNotAvailable(authRequest.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists");
        }
        save(User.builder()
                .username(authRequest.getUsername())
                .email(authRequest.getEmail())
                .phoneNumber(authRequest.getPhoneNumber())
                .role(UserRole.USER)
                .password(passwordEncoder.encode(authRequest.getPassword()))
                .build()
        );
    }
}
