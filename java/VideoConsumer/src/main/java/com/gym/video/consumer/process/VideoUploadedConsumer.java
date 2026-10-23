package com.gym.video.consumer.process;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import com.gym.video.consumer.dto.VideoUploadedEvent;
import com.gym.video.consumer.exceptions.DeleteVideoException;
import com.gym.video.consumer.exceptions.SaveMongoException;
import com.gym.video.consumer.exceptions.VideoProcessingException;
import com.gym.video.consumer.services.VideoProcessingService;

@Component
public class VideoUploadedConsumer {

	private final VideoProcessingService videoProcessingService;

	public VideoUploadedConsumer(VideoProcessingService videoProcessingService) {
		this.videoProcessingService = videoProcessingService;
		;
	}

	@KafkaListener(topics = "${kafka.topics.video-uploaded}", groupId = "${spring.kafka.consumer.group-id}")
	public void consume(VideoUploadedEvent event, Acknowledgment acknowledgment) throws VideoProcessingException, SaveMongoException, DeleteVideoException {
		videoProcessingService.process_video(event);
		acknowledgment.acknowledge();
	}
}