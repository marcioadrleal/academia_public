package com.gym.upload.dto.event;


public record VideoUploadedEvent(
        Long pessoaId,
        Long arquivoId,
        Long processamentoId,
        String tipoExercicio
) {
}