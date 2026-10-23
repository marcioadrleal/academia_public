package com.gym.usercontrol.dto.request;


public record TokenValidationRequest(
        String accessToken,
        String refreshToken
) {
}