package com.gym.usercontrol.dto.request;


import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "O usuário é obrigatório.")
        String username,

        @NotBlank(message = "A senha é obrigatória.")
        String password

) {
}