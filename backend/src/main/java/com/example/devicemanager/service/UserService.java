package com.example.devicemanager.service;

import com.example.devicemanager.dto.LoginRequest;
import com.example.devicemanager.dto.LoginResponse;
import com.example.devicemanager.entity.User;
import com.example.devicemanager.exception.BadRequestException;
import com.example.devicemanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest req) {
        var user = userRepo.findByEmail(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));
        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid credentials");
        }
        var token = jwtService.generateToken(
                user.getEmail(),
                Map.of("uid", user.getId().toString(), "role", user.getRole())
        );
        return new LoginResponse(token, user.getId(), user.getEmail());
    }

    public User save(User u) { return userRepo.save(u); }
}
