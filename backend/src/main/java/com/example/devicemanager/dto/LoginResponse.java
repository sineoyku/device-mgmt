package com.example.devicemanager.dto;

import java.util.UUID;

public record LoginResponse(String token, UUID userId, String email) {}
