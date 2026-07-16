package com.cinema.zalopay;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

@Component
@ConfigurationProperties(prefix = "zalopay")
@Getter
@Setter
public class ZaloPayConfig {

    private int appId = 2553;
    private String key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
    private String key2 = "kLtgPl8HHhfvMuDHPwKyjBsa2B6PRvYf";
    private String endpoint = "https://sb-openapi.zalopay.vn/v2";
}
