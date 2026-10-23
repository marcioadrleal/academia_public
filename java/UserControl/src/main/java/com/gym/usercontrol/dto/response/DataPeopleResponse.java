package com.gym.usercontrol.dto.response;


import java.time.LocalDate;
import java.time.LocalDateTime;

import com.gym.usercontrol.enums.SexoEnum;

public record DataPeopleResponse(

        Long id,
        String nome,
        String email,
        LocalDate dataNascimento,
        SexoEnum sexo,
        String telefone,
        String celular,
        String cep,
        String logradouro,
        String numero,
        String complemento,
        String bairro,
        String cidade,
        String uf,
        Boolean ativo,
        LocalDateTime dataCadastro,
        LocalDateTime dataAtualizacao

) {
}