package com.example.devicemanager.service;

import com.example.devicemanager.entity.User;
import com.example.devicemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        if (!userRepo.existsByEmail("demo@demo.com")) {
            var u = User.builder()
                    .email("demo@demo.com")
                    .passwordHash(encoder.encode("password"))
                    .role("USER")
                    .build();
            userRepo.save(u);
        }
    }
}
