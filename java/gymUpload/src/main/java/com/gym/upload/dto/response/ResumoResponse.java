package com.gym.upload.dto.response;

import java.util.List;

public record ResumoResponse(long analise, long exercicios, ProcessamentoResponse ultimoProcessamento,
		List<ProcessamentoResponse> cincoUltimos) {

}
