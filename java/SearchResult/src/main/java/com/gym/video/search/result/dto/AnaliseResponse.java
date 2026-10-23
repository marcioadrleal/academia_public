package com.gym.video.search.result.dto;

import java.util.List;

public record AnaliseResponse(

        String status,
        String resumo,
        List<String> pontosPositivos,
        List<String> pontosAtencao,
        List<String> recomendacoes

) {
}