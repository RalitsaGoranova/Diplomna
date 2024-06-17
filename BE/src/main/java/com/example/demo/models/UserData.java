package com.example.demo.models;

import org.springframework.security.core.userdetails.User;

public class UserData extends User {
    public UserData(com.example.demo.models.User user) {
        super(user.getUsername(), user.getPassword(), user.getAuthorities());
    }
}
