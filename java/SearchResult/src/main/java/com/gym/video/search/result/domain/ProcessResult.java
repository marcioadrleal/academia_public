package com.gym.video.search.result.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "process_result")
public class ProcessResult {

    @Id
    private String id;

    private Long pessoaId;

    private Long processamentoId;

    private Resultado resultado;

    public ProcessResult() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Resultado getResultado() {
        return resultado;
    }

    public void setResultado(Resultado resultado) {
        this.resultado = resultado;
    }
}