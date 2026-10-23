package com.gym.usercontrol.dto.request;

import jakarta.validation.constraints.NotBlank;

public record NewUserLoginRequest(

        @NotBlank(message = "O nome de usuário é obrigatório.")
        String userName,

        @NotBlank(message = "A senha é obrigatória.")
        String password

) {
}
