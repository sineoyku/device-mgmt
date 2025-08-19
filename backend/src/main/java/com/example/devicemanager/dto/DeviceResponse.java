package com.example.devicemanager.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DeviceResponse(
        UUID id,
        String name,
        String type,
        String serialNumber,
        LocalDateTime createdAt
) {}
