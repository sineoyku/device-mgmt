package com.example.devicemanager.util;

import com.example.devicemanager.dto.DeviceResponse;
import com.example.devicemanager.entity.Device;

public class Mappers {
    public static DeviceResponse toDeviceResponse(Device d) {
        return new DeviceResponse(
                d.getId(),
                d.getName(),
                d.getType().name(),
                d.getSerialNumber(),
                d.getCreatedAt());
    }
}
