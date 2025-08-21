package com.example.devicemanager.entity;

import java.util.Arrays;

public enum DeviceType {
    ALARM,
    CAMERA,
    LIGHT,
    LOCK,
    SENSOR,
    THERMOSTAT,
    HUB,
    CONTROLLER,
    SWITCH,
    DOORBELL,
    AIR_PURIFIER;

    public static DeviceType from(String raw) {
        if (raw == null) throw new IllegalArgumentException("type is null");
        String norm = raw.trim().toUpperCase().replace(' ', '_').replace('-', '_');
        return Arrays.stream(values())
                .filter(v -> v.name().equals(norm))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        "Unsupported device type: " + raw + ". Allowed: " + String.join(", ",
                                Arrays.stream(values()).map(Enum::name).toList())
                ));
    }
}
