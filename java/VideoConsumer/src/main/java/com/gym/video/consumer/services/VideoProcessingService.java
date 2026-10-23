package com.gym.video.consumer.services;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.gym.video.consumer.dto.ProcessExerciseRequest;
import com.gym.video.consumer.dto.VideoUploadedEvent;
import com.gym.video.consumer.exceptions.DeleteVideoException;
import com.gym.video.consumer.exceptions.SaveMongoException;
import com.gym.video.consumer.exceptions.VideoProcessingException;
import com.gym.video.consumer.repository.ProcessResultRepository;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
public class VideoProcessingService {

	private final RestClient restClient;
	private final ObjectMapper objectMapper;
	private final ProcessResultRepository repository;
	private final RestClient gymUploadRestClient;

	public VideoProcessingService(@Qualifier("videoProcessorRestClient") RestClient videoProcessorRestClient,
			@Qualifier("gymUploadRestClient") RestClient gymUploadRestClient, ObjectMapper objectMapper,
			ProcessResultRepository repository) {
		this.repository = repository;
		this.restClient = videoProcessorRestClient;
		this.objectMapper = objectMapper;
		this.gymUploadRestClient = gymUploadRestClient;
	}

	private void saveDatabase(JsonNode json) throws SaveMongoException {
		try {
			repository.save(json);
		} catch (Exception e) {
			e.printStackTrace();
			throw new SaveMongoException("Erro ao Salvar no MongoDb", e);
		}
	}

	public void process_video(VideoUploadedEvent event) throws VideoProcessingException, SaveMongoException, DeleteVideoException {
		JsonNode joson = process(event);
		saveDatabase(joson);
		deleteVideo(event.processamentoId());
	}

	private JsonNode process(VideoUploadedEvent event) throws VideoProcessingException {

		ProcessExerciseRequest request = new ProcessExerciseRequest(event.pessoaId());

		ResponseEntity<JsonNode> response = restClient.post().uri("/api/exercicios/processar").body(request).retrieve()
				.toEntity(JsonNode.class);

		int status = response.getStatusCode().value();

		// Valida HTTP
		if (status < 200 || status > 204) {
			throw new VideoProcessingException("Erro ao processar vídeo. HTTP Status: " + status);
		}

		JsonNode body = response.getBody();

		if (body == null) {
			throw new VideoProcessingException("Video Processor retornou resposta vazia.");
		}

		// Valida processamento.sucesso
		boolean sucesso = body.path("processamento").path("sucesso").asBoolean(false);

		if (!sucesso) {

			JsonNode processamento = body.path("processamento");

			JsonNode erroNode = processamento.path("erro");
			JsonNode detalheNode = processamento.path("detalhe");

			String erro = erroNode.isMissingNode() || erroNode.isNull() ? "Erro durante o processamento do vídeo."
					: erroNode.stringValue();

			String detalhe = detalheNode.isMissingNode() || detalheNode.isNull() ? null : detalheNode.stringValue();

			if (detalhe != null && !detalhe.isBlank()) {
				erro += " Detalhe: " + detalhe;
			}

			throw new VideoProcessingException(erro);
		}

		ObjectNode documento = objectMapper.createObjectNode();

		documento.put("pessoaId", event.pessoaId());
		documento.put("processamentoId", event.processamentoId());
		documento.set("resultado", body);

		return documento;
	}

	private void deleteVideo(Long processamentoId) throws DeleteVideoException {
		try {

			ResponseEntity<Void> response = gymUploadRestClient.delete()
					.uri("/api/arquivos/processamento/{processamentoId}", processamentoId).retrieve()
					.toBodilessEntity();

			int status = response.getStatusCode().value();

			if (status < 200 || status > 204) {
				throw new DeleteVideoException(
						"Erro ao excluir vídeo. HTTP Status: " + status + ". processamentoId=" + processamentoId);
			}
		} catch (Exception e) {

			throw new DeleteVideoException("Erro ao excluir vídeo. processamentoId=" + processamentoId, e);
		}

	}
}