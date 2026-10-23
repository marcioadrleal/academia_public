package com.gym.video.search.result.dto;

public record DadosArticulacaoResponse(

        Boolean valido,
        Integer framesValidos,
        Double anguloMinimo,
        Double anguloMaximo,
        Double anguloMedio,
        Double amplitude,
        Double visibilidadeMedia

) {
}