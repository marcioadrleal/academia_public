package com.gym.video.consumer.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;

import com.gym.video.consumer.util.Parameters;

@Configuration
public class MongoIndexConfig {

    @Bean
    CommandLineRunner createMongoIndexes(MongoTemplate mongoTemplate) {

        return args -> {

            var indexOps = mongoTemplate.indexOps(Parameters.COLLECTION_MONGO);

            indexOps.createIndex(
                new Index()
                    .on("pessoaId", Direction.ASC)
                    .named("idx_pessoa_id")
            );

            indexOps.createIndex(
                new Index()
                    .on("processamentoId", Direction.ASC)
                    .unique()
                    .named("idx_processamento_id")
            );
        };
    }
}