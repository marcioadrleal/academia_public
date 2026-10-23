package com.gym.video.search.result.domain;

import org.springframework.data.mongodb.core.mapping.Field;

public class DadosArticulacao {

    private Boolean valido;

    @Field("frames_validos")
    private Integer framesValidos;

    @Field("angulo_minimo")
    private Double anguloMinimo;

    @Field("angulo_maximo")
    private Double anguloMaximo;

    @Field("angulo_medio")
    private Double anguloMedio;

    private Double amplitude;

    @Field("visibilidade_media")
    private Double visibilidadeMedia;

    public DadosArticulacao() {
    }

    public Boolean getValido() {
        return valido;
    }

    public void setValido(Boolean valido) {
        this.valido = valido;
    }

    public Integer getFramesValidos() {
        return framesValidos;
    }

    public void setFramesValidos(Integer framesValidos) {
        this.framesValidos = framesValidos;
    }

    public Double getAnguloMinimo() {
        return anguloMinimo;
    }

    public void setAnguloMinimo(Double anguloMinimo) {
        this.anguloMinimo = anguloMinimo;
    }

    public Double getAnguloMaximo() {
        return anguloMaximo;
    }

    public void setAnguloMaximo(Double anguloMaximo) {
        this.anguloMaximo = anguloMaximo;
    }

    public Double getAnguloMedio() {
        return anguloMedio;
    }

    public void setAnguloMedio(Double anguloMedio) {
        this.anguloMedio = anguloMedio;
    }

    public Double getAmplitude() {
        return amplitude;
    }

    public void setAmplitude(Double amplitude) {
        this.amplitude = amplitude;
    }

    public Double getVisibilidadeMedia() {
        return visibilidadeMedia;
    }

    public void setVisibilidadeMedia(Double visibilidadeMedia) {
        this.visibilidadeMedia = visibilidadeMedia;
    }
}