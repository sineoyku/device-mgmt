package com.example.devicemanager.service;

import com.example.devicemanager.dto.DeviceRequest;
import com.example.devicemanager.dto.DeviceResponse;
import com.example.devicemanager.entity.Device;
import com.example.devicemanager.exception.BadRequestException;
import com.example.devicemanager.exception.NotFoundException;
import com.example.devicemanager.repository.DeviceRepository;
import com.example.devicemanager.util.Mappers;
import com.example.devicemanager.entity.DeviceType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepo;

    public List<DeviceResponse> list(UUID userId) {
        return deviceRepo.findAllByUserId(userId).stream().map(Mappers::toDeviceResponse).toList();
    }

    public DeviceResponse get(UUID id, UUID userId) {
        var d = deviceRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Device not found"));
        return Mappers.toDeviceResponse(d);
    }

    public DeviceResponse create(DeviceRequest req, UUID userId) {
        if (deviceRepo.existsBySerialNumber(req.serialNumber())) {
            throw new BadRequestException("serialNumber must be unique");
        }
        //CHECKING DT
        final DeviceType dt;
        try {
            dt = DeviceType.from(req.type());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }
        //
        var d = Device.builder()
                .name(req.name())
                .type(dt) //ENUM
                .serialNumber(req.serialNumber())
                .userId(userId)
                .build();
        return Mappers.toDeviceResponse(deviceRepo.save(d));
    }

    public DeviceResponse update(UUID id, DeviceRequest req, UUID userId) {
        var d = deviceRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Device not found"));

        if (deviceRepo.existsBySerialNumberAndIdNot(req.serialNumber(), d.getId())) {
            throw new BadRequestException("serialNumber must be unique");
        }
        //CHECKING DT
        final DeviceType dt;
        try {
            dt = DeviceType.from(req.type());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException(ex.getMessage());
        }
        //
        d.setName(req.name());
        d.setType(dt); //ENUM
        d.setSerialNumber(req.serialNumber());
        return Mappers.toDeviceResponse(deviceRepo.save(d));
    }

    public void delete(UUID id, UUID userId) {
        var d = deviceRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new NotFoundException("Device not found"));
        deviceRepo.delete(d);
    }
}
