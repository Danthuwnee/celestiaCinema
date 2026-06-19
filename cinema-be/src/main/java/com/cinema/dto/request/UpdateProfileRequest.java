package com.cinema.dto.request;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    private String fullName;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String avatar;
}
