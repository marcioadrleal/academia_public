package com.gym.upload.services;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.gym.upload.dto.event.VideoUploadedEvent;


@Service
public class VideoUploadedProducer {

    private final String topic;

    private final KafkaTemplate<String, VideoUploadedEvent> kafkaTemplate;

    public VideoUploadedProducer(
            KafkaTemplate<String, VideoUploadedEvent> kafkaTemplate ,
            @Value("${topic.kafka}") String topic ) {

        this.kafkaTemplate = kafkaTemplate;
        this.topic = topic;
    }

    public void publicar(VideoUploadedEvent evento) {

        kafkaTemplate.send(
                topic,
                evento.processamentoId().toString(),
                evento
        );
    }
}