package com.gym.usercontrol.dto.request;


import java.time.LocalDate;

import com.gym.usercontrol.enums.SexoEnum;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DataPeopleRequest(

        @NotBlank(message = "O nome é obrigatório.")
        @Size(
            max = 150,
            message = "O nome deve possuir no máximo 150 caracteres."
        )
        String nome,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail informado é inválido.")
        @Size(
            max = 200,
            message = "O e-mail deve possuir no máximo 200 caracteres."
        )
        String email,

        @Past(message = "A data de nascimento deve ser uma data anterior à data atual.")
        LocalDate dataNascimento,

        SexoEnum sexo,

        @Size(
            max = 20,
            message = "O telefone deve possuir no máximo 20 caracteres."
        )
        @Pattern(
            regexp = "^\\d*$",
            message = "O telefone deve conter somente números."
        )
        String telefone,

        @Size(
            max = 20,
            message = "O celular deve possuir no máximo 20 caracteres."
        )
        @Pattern(
            regexp = "^\\d*$",
            message = "O celular deve conter somente números."
        )
        String celular,

        @Pattern(
            regexp = "^\\d{8}$",
            message = "O CEP deve possuir exatamente 8 números."
        )
        String cep,

        @Size(
            max = 200,
            message = "O logradouro deve possuir no máximo 200 caracteres."
        )
        String logradouro,

        @Size(
            max = 20,
            message = "O número deve possuir no máximo 20 caracteres."
        )
        String numero,

        @Size(
            max = 100,
            message = "O complemento deve possuir no máximo 100 caracteres."
        )
        String complemento,

        @Size(
            max = 100,
            message = "O bairro deve possuir no máximo 100 caracteres."
        )
        String bairro,

        @Size(
            max = 100,
            message = "A cidade deve possuir no máximo 100 caracteres."
        )
        String cidade,

        @Pattern(
            regexp = "^[A-Za-z]{2}$",
            message = "A UF deve possuir exatamente 2 letras."
        )
        String uf ,
        String userId

) {
}