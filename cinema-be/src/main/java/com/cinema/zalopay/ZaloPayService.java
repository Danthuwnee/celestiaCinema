package com.cinema.zalopay;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.cinema.zalopay.crypto.HMACUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ZaloPayService {

    private final ZaloPayConfig config;
    private final ObjectMapper objectMapper;

    public Map<String, Object> createOrder(String appUserId, long amount, String description, String embedData) throws Exception {
        String appTransId = generateAppTransId();
        long appTime = System.currentTimeMillis();

        String items = "[]";
        String macData = config.getAppId() + "|" + appTransId + "|" + appUserId + "|" + amount + "|" + appTime + "|" + embedData + "|" + items;
        String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, config.getKey1(), macData);

        Map<String, Object> order = new HashMap<>();
        order.put("app_id", config.getAppId());
        order.put("app_trans_id", appTransId);
        order.put("app_user", appUserId);
        order.put("app_time", appTime);
        order.put("amount", amount);
        order.put("description", description);
        order.put("embed_data", embedData);
        order.put("item", items);
        order.put("bank_code", "");
        order.put("mac", mac);

        String body = objectMapper.writeValueAsString(order);

        URL url = new URL(config.getEndpoint() + "/create");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new RuntimeException("ZaloPay API error: " + responseCode);
        }

        byte[] responseBytes = conn.getInputStream().readAllBytes();
        String responseBody = new String(responseBytes, StandardCharsets.UTF_8);

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

        URL url = new URL(config.getEndpoint() + "/query");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != 200) {
            throw new RuntimeException("ZaloPay query error: " + responseCode);
        }

        byte[] responseBytes = conn.getInputStream().readAllBytes();
        String responseBody = new String(responseBytes, StandardCharsets.UTF_8);
        return objectMapper.readValue(responseBody, Map.class);
    }

    private String generateAppTransId() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String uid = UUID.randomUUID().toString().substring(0, 8);
        return date + "_" + uid;
    }
}
