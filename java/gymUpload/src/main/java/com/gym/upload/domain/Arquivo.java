package com.gym.upload.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "arquivo")
public class Arquivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pessoa_id", nullable = false)
    private Pessoa pessoa;

    @Column(name = "nome_original", nullable = false)
    private String nomeOriginal;

    @Column(name = "nome_storage", nullable = false)
    private String nomeStorage;

    @Column(nullable = false)
    private String bucket;

    @Column(name = "tipo_exercicio", nullable = false)
    private String tipoExercicio;

    @Column(name = "content_type")
    private String contentType;

    private Long tamanho;

    @Column(name = "data_upload", nullable = false)
    private LocalDateTime dataUpload;

    @PrePersist
    public void prePersist() {
        if (dataUpload == null) {
            dataUpload = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public Pessoa getPessoa() {
        return pessoa;
    }

    public String getNomeOriginal() {
        return nomeOriginal;
    }

    public String getNomeStorage() {
        return nomeStorage;
    }

    public String getBucket() {
        return bucket;
    }

    public String getTipoExercicio() {
        return tipoExercicio;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getTamanho() {
        return tamanho;
    }

    public LocalDateTime getDataUpload() {
        return dataUpload;
    }

    public void setPessoa(Pessoa pessoa) {
        this.pessoa = pessoa;
    }

    public void setNomeOriginal(String nomeOriginal) {
        this.nomeOriginal = nomeOriginal;
    }

    public void setNomeStorage(String nomeStorage) {
        this.nomeStorage = nomeStorage;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public void setTipoExercicio(String tipoExercicio) {
        this.tipoExercicio = tipoExercicio;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setTamanho(Long tamanho) {
        this.tamanho = tamanho;
    }
}
