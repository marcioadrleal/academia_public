package com.gym.video.search.result.dto;

public record ProcessResultResponse(

        String id,
        Long pessoaId,
        Long processamentoId,
        ResultadoResponse resultado

) {
}
