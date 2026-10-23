package com.gym.video.search.result.dto;

import java.util.Map;

public record ProcessamentoResponse(

        Boolean sucesso,
        Long pessoaId,
        Long processamentoId,
        Long arquivoId,
        String nomeArquivo,
        String exercicio,
        Integer totalFrames,
        Integer framesComPose,
        Map<String, DadosArticulacaoResponse> resumo

) {
}