package com.example.devicemanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DeviceRequest(
        @NotBlank @Size(max = 255) String name,
        @NotBlank @Size(max = 64) String type,
        @NotBlank @Size(max = 128) String serialNumber
) {}
