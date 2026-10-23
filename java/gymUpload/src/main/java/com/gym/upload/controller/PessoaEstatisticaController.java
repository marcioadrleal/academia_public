package com.gym.upload.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gym.upload.dto.response.ResumoResponse;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.services.ArquivoDownloadService;

@RestController
@RequestMapping("/api/pessoas/estatistica")
public class PessoaEstatisticaController {

	private final ArquivoDownloadService service;

	public PessoaEstatisticaController(ArquivoDownloadService service) {
		this.service = service;
	}

	@GetMapping("/{pessoaId}")
	public ResponseEntity<ResumoResponse> resumo(@PathVariable Long pessoaId) throws InformacoesNaoEncontradaException {

		ResumoResponse response = service.resumo(pessoaId);

		return ResponseEntity.ok(response);
	}

}
