package com.gym.usercontrol.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gym.usercontrol.dto.request.LoginRequest;
import com.gym.usercontrol.dto.request.TokenValidationRequest;
import com.gym.usercontrol.dto.response.LoginResponse;
import com.gym.usercontrol.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(
            AuthService authService) {

        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid
            @RequestBody
            LoginRequest request) throws Exception {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }
    
    @PostMapping("/validate")
    public ResponseEntity<LoginResponse> validarToken(
            @RequestBody
            TokenValidationRequest request
    ) throws Exception {

        LoginResponse response =
                authService
                        .validarOuRenovarToken(
                                request.accessToken(),
                                request.refreshToken()
                        );

        return ResponseEntity.ok(
                response
        );
    }
    
    
}
