package com.gym.upload.dto.response;

import java.time.LocalDateTime;

public record ProcessamentoResponse(
        Long processamentoId,
        Long pessoaId,
        Long arquivoId,
        String nomeArquivo,
        String tipoExercicio,
        Boolean publicado,
        LocalDateTime dataEntrada,
        LocalDateTime dataProcessamento
) {

    public boolean processado() {
        return dataProcessamento != null;
    }
}