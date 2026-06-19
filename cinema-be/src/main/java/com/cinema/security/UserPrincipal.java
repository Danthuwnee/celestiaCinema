package com.cinema.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserPrincipal {

    private String userId;
    private String fullName;
    private String role;
}
