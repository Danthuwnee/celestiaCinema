package com.cinema.zalopay;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.cinema.zalopay.crypto.HMACUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZaloPayService {

    private static final Logger log = LoggerFactory.getLogger(ZaloPayService.class);

    private final ZaloPayConfig config;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public Map<String, Object> createOrder(String appUserId, long amount, String description, String embedDataRaw) throws Exception {
        String appTransId = generateAppTransId();
        long appTime = System.currentTimeMillis();

        String itemRaw = "[]";
        String embedDataB64 = Base64.getEncoder().encodeToString(embedDataRaw.getBytes(StandardCharsets.UTF_8));
        String itemB64 = Base64.getEncoder().encodeToString(itemRaw.getBytes(StandardCharsets.UTF_8));

        String macData = config.getAppId() + "|" + appTransId + "|" + appUserId + "|" + amount + "|" + appTime + "|" + embedDataB64 + "|" + itemB64;
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKey1(), macData);

        Map<String, Object> order = new HashMap<>();
        order.put("app_id", config.getAppId());
        order.put("app_trans_id", appTransId);
        order.put("app_user", appUserId);
        order.put("app_time", appTime);
        order.put("amount", amount);
        order.put("description", description);
        order.put("embed_data", embedDataB64);
        order.put("item", itemB64);
        order.put("bank_code", "zalopayapp");
        order.put("mac", mac);

        String body = objectMapper.writeValueAsString(order);
        log.debug("ZaloPay create order request: {}", body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(config.getEndpoint() + "/create"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        String responseBody = response.body();
        log.debug("ZaloPay create order response ({}): {}", response.statusCode(), responseBody);

        if (response.statusCode() != 200) {
            throw new RuntimeException("ZaloPay API HTTP " + response.statusCode() + ": " + responseBody);
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);
        result.put("app_trans_id", appTransId);
        return result;
    }

    public boolean verifyCallback(Map<String, String> params) {
        String macReceived = params.get("mac");
        String data = params.get("data");
        if (macReceived == null || data == null) return false;

        String macExpected = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKey2(), data);
        return macExpected.equals(macReceived);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> queryOrder(String appTransId) throws Exception {
        String macData = config.getAppId() + "|" + appTransId + "|" + config.getKey1();
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKey1(), macData);

        Map<String, Object> query = new HashMap<>();
        query.put("app_id", config.getAppId());
        query.put("app_trans_id", appTransId);
        query.put("mac", mac);

        String body = objectMapper.writeValueAsString(query);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(config.getEndpoint() + "/query"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(body, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        if (response.statusCode() != 200) {
            throw new RuntimeException("ZaloPay query error: " + response.statusCode() + ": " + response.body());
        }

        return objectMapper.readValue(response.body(), Map.class);
    }

    private String generateAppTransId() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String uid = UUID.randomUUID().toString().substring(0, 8);
        return date + "_" + uid;
    }
}
