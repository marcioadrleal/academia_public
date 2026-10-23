package com.gym.video.consumer.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

	@Bean
	public RestClient videoProcessorRestClient(RestClient.Builder builder,
			@Value("${services.video-processor.url}") String baseUrl) {

		return builder.baseUrl(baseUrl).build();
	}

	@Bean
	public RestClient gymUploadRestClient(RestClient.Builder builder,
			@Value("${services.gym-upload.url}") String baseUrl) {

		return builder.baseUrl(baseUrl).build();
	}
}