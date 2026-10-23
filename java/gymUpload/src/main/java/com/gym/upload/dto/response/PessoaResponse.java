package com.gym.upload.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.gym.upload.enums.SexoEnum;

public record PessoaResponse(

		Long id, String nome, String email, LocalDate dataNascimento, SexoEnum sexo, String telefone, String celular,
		String cep, String logradouro, String numero, String complemento, String bairro, String cidade, String uf,
		Boolean ativo, LocalDateTime dataCadastro, LocalDateTime dataAtualizacao

) {
}