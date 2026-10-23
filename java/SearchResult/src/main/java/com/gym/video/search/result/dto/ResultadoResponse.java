package com.gym.video.search.result.dto;

import java.time.Instant;

public record ResultadoResponse(

        Long pessoaId,
        Instant dataProcessamento,
        ProcessamentoResponse processamento,
        AnaliseResponse analise

) {
}