package com.gym.video.search.result.domain;

import java.time.Instant;

import org.springframework.data.mongodb.core.mapping.Field;

public class Resultado {

    @Field("pessoa_id")
    private Long pessoaId;

    @Field("data_processamento")
    private Instant dataProcessamento;

    private Processamento processamento;

    private Analise analise;

    public Resultado() {
    }

    public Long getPessoaId() {
        return pessoaId;
    }

    public void setPessoaId(Long pessoaId) {
        this.pessoaId = pessoaId;
    }

    public Instant getDataProcessamento() {
        return dataProcessamento;
    }

    public void setDataProcessamento(Instant dataProcessamento) {
        this.dataProcessamento = dataProcessamento;
    }

    public Processamento getProcessamento() {
        return processamento;
    }

    public void setProcessamento(Processamento processamento) {
        this.processamento = processamento;
    }

    public Analise getAnalise() {
        return analise;
    }

    public void setAnalise(Analise analise) {
        this.analise = analise;
    }
}