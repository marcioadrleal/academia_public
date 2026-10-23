package com.gym.upload.dto.request;

public record UploadRequest(
        Long pessoaId,
        String tipoExercicio
) {
}