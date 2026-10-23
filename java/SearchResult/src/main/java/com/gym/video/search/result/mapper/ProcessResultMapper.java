package com.gym.video.search.result.mapper;


import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.gym.video.search.result.domain.Analise;
import com.gym.video.search.result.domain.DadosArticulacao;
import com.gym.video.search.result.domain.ProcessResult;
import com.gym.video.search.result.domain.Processamento;
import com.gym.video.search.result.domain.Resultado;
import com.gym.video.search.result.dto.AnaliseResponse;
import com.gym.video.search.result.dto.DadosArticulacaoResponse;
import com.gym.video.search.result.dto.ProcessResultResponse;
import com.gym.video.search.result.dto.ProcessamentoResponse;
import com.gym.video.search.result.dto.ResultadoResponse;

@Component
public class ProcessResultMapper {

    public ProcessResultResponse toResponse(
            ProcessResult domain) {

        if (domain == null) {
            return null;
        }

        return new ProcessResultResponse(
                domain.getId(),
                domain.getPessoaId(),
                domain.getProcessamentoId(),
                toResultadoResponse(
                        domain.getResultado()
                )
        );
    }

    private ResultadoResponse toResultadoResponse(
            Resultado domain) {

        if (domain == null) {
            return null;
        }

        return new ResultadoResponse(
                domain.getPessoaId(),
                domain.getDataProcessamento(),
                toProcessamentoResponse(
                        domain.getProcessamento()
                ),
                toAnaliseResponse(
                        domain.getAnalise()
                )
        );
    }

    private ProcessamentoResponse toProcessamentoResponse(
            Processamento domain) {

        if (domain == null) {
            return null;
        }

        return new ProcessamentoResponse(
                domain.getSucesso(),
                domain.getPessoaId(),
                domain.getProcessamentoId(),
                domain.getArquivoId(),
                domain.getNomeArquivo(),
                domain.getExercicio(),
                domain.getTotalFrames(),
                domain.getFramesComPose(),
                toResumoResponse(
                        domain.getResumo()
                )
        );
    }

    private Map<String, DadosArticulacaoResponse>
    toResumoResponse(
            Map<String, DadosArticulacao> resumo) {

        if (resumo == null || resumo.isEmpty()) {
            return Collections.emptyMap();
        }

        return resumo.entrySet()
                .stream()
                .collect(
                        Collectors.toMap(
                                Map.Entry::getKey,
                                entry ->
                                        toDadosArticulacaoResponse(
                                                entry.getValue()
                                        )
                        )
                );
    }

    private DadosArticulacaoResponse
    toDadosArticulacaoResponse(
            DadosArticulacao domain) {

        if (domain == null) {
            return null;
        }

        return new DadosArticulacaoResponse(
                domain.getValido(),
                domain.getFramesValidos(),
                domain.getAnguloMinimo(),
                domain.getAnguloMaximo(),
                domain.getAnguloMedio(),
                domain.getAmplitude(),
                domain.getVisibilidadeMedia()
        );
    }

    private AnaliseResponse toAnaliseResponse(
            Analise domain) {

        if (domain == null) {
            return null;
        }

        return new AnaliseResponse(
                domain.getStatus(),
                domain.getResumo(),
                domain.getPontosPositivos(),
                domain.getPontosAtencao(),
                domain.getRecomendacoes()
        );
    }
}