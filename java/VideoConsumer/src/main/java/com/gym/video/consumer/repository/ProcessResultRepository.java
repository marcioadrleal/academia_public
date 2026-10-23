package com.gym.video.consumer.repository;

import java.time.OffsetDateTime;
import java.util.Date;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.gym.video.consumer.util.Parameters;

import tools.jackson.databind.JsonNode;

@Repository
public class ProcessResultRepository {

    private static final String COLLECTION =
            Parameters.COLLECTION_MONGO;

    private final MongoTemplate mongoTemplate;

    public ProcessResultRepository(
            MongoTemplate mongoTemplate) {

        this.mongoTemplate = mongoTemplate;
    }

    public void save(JsonNode json) {

        Document document =
                Document.parse(
                        json.toString()
                );

        converterDataProcessamento(
                document
        );

        mongoTemplate.insert(
                document,
                COLLECTION
        );
    }

    private void converterDataProcessamento(
            Document document) {

        /*
         * Estrutura real:
         *
         * {
         *   "pessoaId": 1,
         *   "processamentoId": 1,
         *   "resultado": {
         *
         *       "pessoa_id": 1,
         *
         *       "data_processamento":
         *          "2026-09-12T21:23:35.211805+00:00",
         *
         *       "processamento": {
         *          ...
         *       },
         *
         *       "analise": {
         *          ...
         *       }
         *   }
         * }
         */

        Document resultado =
                document.get(
                        "resultado",
                        Document.class
                );

        if (resultado == null) {
            return;
        }

        Object valor =
                resultado.get(
                        "data_processamento"
                );

        if (valor == null) {
            return;
        }

        /*
         * Caso já tenha sido convertido.
         */
        if (valor instanceof Date) {
            return;
        }

        /*
         * Esperamos uma String enviada
         * pelo Python.
         */
        if (!(valor instanceof String dataProcessamento)) {
            return;
        }

        if (dataProcessamento.isBlank()) {
            return;
        }

        try {

            /*
             * Exemplo recebido:
             *
             * 2026-09-12T21:23:35.211805+00:00
             *
             * Como possui offset +00:00,
             * usamos OffsetDateTime.
             */
            OffsetDateTime offsetDateTime =
                    OffsetDateTime.parse(
                            dataProcessamento
                    );

            Date data =
                    Date.from(
                            offsetDateTime
                                    .toInstant()
                    );

            /*
             * Substitui String por
             * java.util.Date.
             */
            resultado.put(
                    "data_processamento",
                    data
            );

        } catch (Exception ex) {

            throw new IllegalArgumentException(
                    "Data de processamento inválida: "
                            + dataProcessamento,
                    ex
            );
        }
    }
}