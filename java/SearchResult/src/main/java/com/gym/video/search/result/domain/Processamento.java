package com.gym.video.search.result.domain;

import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Field;

public class Processamento {

    private Boolean sucesso;

    @Field("pessoa_id")
    private Long pessoaId;

    @Field("processamento_id")
    private Long processamentoId;

    @Field("arquivo_id")
    private Long arquivoId;

    @Field("nome_arquivo")
    private String nomeArquivo;

    private String exercicio;

    @Field("total_frames")
    private Integer totalFrames;

    @Field("frames_com_pose")
    private Integer framesComPose;

    private Map<String, DadosArticulacao> resumo;

    public Processamento() {
    }

    public Boolean getSucesso() {
        return sucesso;
    }

    public void setSucesso(Boolean sucesso) {
        this.sucesso = sucesso;
    }

    public Long getPessoaId() {
        return pessoaId;
    }

    public void setPessoaId(Long pessoaId) {
        this.pessoaId = pessoaId;
    }

    public Long getProcessamentoId() {
        return processamentoId;
    }

    public void setProcessamentoId(Long processamentoId) {
        this.processamentoId = processamentoId;
    }

    public Long getArquivoId() {
        return arquivoId;
    }

    public void setArquivoId(Long arquivoId) {
        this.arquivoId = arquivoId;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public void setNomeArquivo(String nomeArquivo) {
        this.nomeArquivo = nomeArquivo;
    }

    public String getExercicio() {
        return exercicio;
    }

    public void setExercicio(String exercicio) {
        this.exercicio = exercicio;
    }

    public Integer getTotalFrames() {
        return totalFrames;
    }

    public void setTotalFrames(Integer totalFrames) {
        this.totalFrames = totalFrames;
    }

    public Integer getFramesComPose() {
        return framesComPose;
    }

    public void setFramesComPose(Integer framesComPose) {
        this.framesComPose = framesComPose;
    }

    public Map<String, DadosArticulacao> getResumo() {
        return resumo;
    }

    public void setResumo(Map<String, DadosArticulacao> resumo) {
        this.resumo = resumo;
    }
}