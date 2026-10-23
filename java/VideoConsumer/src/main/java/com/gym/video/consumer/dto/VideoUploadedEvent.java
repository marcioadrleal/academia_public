package com.gym.video.consumer.dto;

public record VideoUploadedEvent(

        Long pessoaId,

        Long arquivoId,

        Long processamentoId,

        String nomeArquivo,

        String tipoExercicio

) {
}