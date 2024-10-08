package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.models.dtos.AuthRequest;
import com.example.demo.models.dtos.AuthRequestLogin;
import com.example.demo.models.dtos.UserDTO;
import com.example.demo.services.AuthenticationService;
import com.example.demo.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200/")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationService authService;

    @Autowired
    public UserController(UserService userService, AuthenticationService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/{id}")
    @Secured({})
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getById(id)
                .orElseThrow(() -> new DataRetrievalFailureException("User could not be found"));
        return new ResponseEntity<>(new UserDTO(user), HttpStatus.OK);
    }
    @GetMapping("/username/{username}")
    @Secured({})
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        User user = userService.getByUsername(username);
        System.out.println(user);
        System.out.println(new UserDTO(user));
        return new ResponseEntity<>(new UserDTO(user), HttpStatus.OK);
    }

    @PostMapping("/register")
    public void register(@RequestBody AuthRequest authRequest) {
        System.out.println(authRequest);
        this.userService.addUser(authRequest);
    }

    @PostMapping("/login")
    public ResponseEntity<String> authenticate(@RequestBody AuthRequestLogin authRequest) {
        String token = authService.authenticate(authRequest);
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(token);
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();  // Invalidate the session if it exists
        }

        return ResponseEntity.ok("Logged out successfully");
    }
//    @PostMapping("/login")
//    public String authenticate(@RequestBody AuthRequestLogin authRequest) {
//        return authService.authenticate(authRequest);
//    }




    @GetMapping
    @Secured({"ADMIN"})
    public ResponseEntity<List<User>> list() {
        return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
    }
}
