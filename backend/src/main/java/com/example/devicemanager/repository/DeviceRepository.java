package com.example.devicemanager.repository;

import com.example.devicemanager.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    List<Device> findAllByUserId(UUID userId);
    Optional<Device> findByIdAndUserId(UUID id, UUID userId);

    boolean existsBySerialNumber(String serialNumber);
    boolean existsBySerialNumberAndIdNot(String serialNumber, UUID id);
}
