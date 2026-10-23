package com.gym.video.search.result.domain;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Field;

public class Analise {

    private String status;

    private String resumo;

    @Field("pontos_positivos")
    private List<String> pontosPositivos;

    @Field("pontos_atencao")
    private List<String> pontosAtencao;

    private List<String> recomendacoes;

    public Analise() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResumo() {
        return resumo;
    }

    public void setResumo(String resumo) {
        this.resumo = resumo;
    }

    public List<String> getPontosPositivos() {
        return pontosPositivos;
    }

    public void setPontosPositivos(List<String> pontosPositivos) {
        this.pontosPositivos = pontosPositivos;
    }

    public List<String> getPontosAtencao() {
        return pontosAtencao;
    }

    public void setPontosAtencao(List<String> pontosAtencao) {
        this.pontosAtencao = pontosAtencao;
    }

    public List<String> getRecomendacoes() {
        return recomendacoes;
    }

    public void setRecomendacoes(List<String> recomendacoes) {
        this.recomendacoes = recomendacoes;
    }
}