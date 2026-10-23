package com.gym.usercontrol.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "A senha atual é obrigatória.")
        String senhaAtual,

        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(
                min = 8,
                message = "A nova senha deve possuir no mínimo 8 caracteres."
        )
        String novaSenha

) {
}