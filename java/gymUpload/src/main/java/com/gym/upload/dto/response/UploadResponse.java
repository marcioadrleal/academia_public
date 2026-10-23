package com.gym.upload.dto.response;

import java.time.LocalDateTime;

public record UploadResponse(Long arquivoId, Long pessoaId, String nomeOriginal, String nomeStorage, String bucket,
		String tipoExercicio, String contentType, Long tamanho, Boolean baixado, LocalDateTime dataEntrada,
		LocalDateTime dataProcessamento) {
}