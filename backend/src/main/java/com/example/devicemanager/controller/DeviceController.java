package com.example.devicemanager.controller;

import com.example.devicemanager.dto.DeviceRequest;
import com.example.devicemanager.dto.DeviceResponse;
import com.example.devicemanager.service.CustomUserDetails;
import com.example.devicemanager.service.DeviceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
public class DeviceController {

    private final DeviceService deviceService;

    private UUID userId(Authentication auth) {
        var principal = (CustomUserDetails) auth.getPrincipal();
        return principal.getId();
    }

    @GetMapping
    public ResponseEntity<List<DeviceResponse>> list(Authentication auth) {
        return ResponseEntity.ok(deviceService.list(userId(auth)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceResponse> get(@PathVariable UUID id, Authentication auth) {
        return ResponseEntity.ok(deviceService.get(id, userId(auth)));
    }

    @PostMapping
    public ResponseEntity<DeviceResponse> create(@RequestBody @Valid DeviceRequest req, Authentication auth) {
        return ResponseEntity.ok(deviceService.create(req, userId(auth)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceResponse> update(@PathVariable UUID id,
                                                 @RequestBody @Valid DeviceRequest req,
                                                 Authentication auth) {
        return ResponseEntity.ok(deviceService.update(id, req, userId(auth)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, Authentication auth) {
        deviceService.delete(id, userId(auth));
        return ResponseEntity.noContent().build();
    }
}
