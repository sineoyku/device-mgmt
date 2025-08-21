package com.example.devicemanager.repository;

import com.example.devicemanager.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DeviceRepository extends JpaRepository<Device, UUID> {
    Page<Device> findAllByUserId(UUID userId, Pageable pageable);
    Optional<Device> findByIdAndUserId(UUID id, UUID userId);

    boolean existsBySerialNumber(String serialNumber);
    boolean existsBySerialNumberAndIdNot(String serialNumber, UUID id);
}
