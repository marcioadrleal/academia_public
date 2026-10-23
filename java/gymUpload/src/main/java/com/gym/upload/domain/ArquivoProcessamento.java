package com.gym.upload.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "arquivo_processamento")
public class ArquivoProcessamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pessoa_id", nullable = false)
    private Pessoa pessoa;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arquivo_id", nullable = false)
    private Arquivo arquivo;

    @Column(nullable = false)
    private Boolean publicado = false;

    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @Column(name = "data_processamento")
    private LocalDateTime dataProcessamento;

    @PrePersist
    public void prePersist() {

        if (dataEntrada == null) {
            dataEntrada = LocalDateTime.now();
        }

        if (publicado == null) {
            publicado = false;
        }
    }

    public Long getId() {
        return id;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public Arquivo getArquivo() {
        return arquivo;
    }

    public Boolean getPublicado() {
        return publicado;
    }

    public LocalDateTime getDataEntrada() {
        return dataEntrada;
    }

    public LocalDateTime getDataProcessamento() {
        return dataProcessamento;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public void setArquivo(Arquivo arquivo) {
        this.arquivo = arquivo;
    }

    public void setPublicado(Boolean publicado) {
        this.publicado = publicado;
    }

    public void setDataProcessamento(LocalDateTime dataProcessamento) {
        this.dataProcessamento = dataProcessamento;
    }
}
