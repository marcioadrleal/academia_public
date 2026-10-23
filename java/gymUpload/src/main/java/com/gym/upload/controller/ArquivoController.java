package com.gym.upload.controller;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import com.gym.upload.domain.Arquivo;
import com.gym.upload.domain.ArquivoProcessamento;
import com.gym.upload.dto.response.ProcessamentoResponse;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.services.ArquivoDownloadService;

@RestController
@RequestMapping("/api/arquivos")
public class ArquivoController {

	private final ArquivoDownloadService arquivoDownloadService;

	public ArquivoController(ArquivoDownloadService arquivoDownloadService) {

		this.arquivoDownloadService = arquivoDownloadService;
	}

	@GetMapping("/pessoa/info/{pessoaId}")
	public ResponseEntity<ProcessamentoResponse> buscarArquivoPendente(@PathVariable Long pessoaId)
			throws InformacoesNaoEncontradaException {

		ProcessamentoResponse response = arquivoDownloadService.buscarArquivoPendente(pessoaId);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/processamento/{processamentoId}")
	public ResponseEntity<Void> excluirVideo(@PathVariable Long processamentoId)
			throws InformacoesNaoEncontradaException {

		arquivoDownloadService.excluirVideoPorProcessamento(processamentoId);

		return ResponseEntity.noContent().build();
	}

	@GetMapping("/pessoa/{pessoaId}/pendente")
	public ResponseEntity<StreamingResponseBody> baixarArquivoPendente(@PathVariable Long pessoaId)
			throws InformacoesNaoEncontradaException {

		/*
		 * 1. Busca os dados do processamento.
		 *
		 * Essa operação ocorre dentro da transação readOnly do Service.
		 */
		ArquivoProcessamento processamento = arquivoDownloadService.buscarArquivoPendenteMaisAntigo(pessoaId);

		/*
		 * 2. Obtém o arquivo enquanto a entidade ainda está disponível.
		 */
		Arquivo arquivo = processamento.getArquivo();

		/*
		 * 3. Extraímos todos os dados necessários antes de criar o
		 * StreamingResponseBody.
		 *
		 * Assim a execução posterior do streaming não dependerá de entidades
		 * JPA/Hibernate.
		 */
		Long processamentoId = processamento.getId();

		String bucket = arquivo.getBucket();

		String nomeStorage = arquivo.getNomeStorage();

		String nomeOriginal = arquivo.getNomeOriginal();

		String contentType = arquivo.getContentType();

		/*
		 * 4. Content-Type padrão caso não tenha sido armazenado no banco.
		 */
		if (contentType == null || contentType.isBlank()) {

			contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
		}

		/*
		 * 5. O Spring executará esta lambda depois que o Controller retornar.
		 */
		StreamingResponseBody stream = outputStream -> {

			/*
			 * Faz o streaming MinIO -> cliente.
			 *
			 * Se ocorrer uma exceção aqui, darBaixa() NÃO será executado.
			 */
			arquivoDownloadService.realizarDownload(bucket, nomeStorage, outputStream);

			/*
			 * Só marca como processado depois que transferTo + flush terminarem.
			 *
			 * darBaixa possui sua própria
			 * 
			 * @Transactional.
			 */
			arquivoDownloadService.darBaixa(processamentoId);
		};

		/*
		 * Por enquanto NÃO estamos enviando Content-Length.
		 *
		 * Isso permite o uso de transferência chunked e facilita diagnosticar problemas
		 * de streaming.
		 */
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION,
						ContentDisposition.attachment().filename(nomeOriginal).build().toString())
				.contentType(MediaType.parseMediaType(contentType)).body(stream);
	}
}