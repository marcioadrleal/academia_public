package com.gym.video.search.result.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gym.video.search.result.dto.ProcessResultResponse;
import com.gym.video.search.result.service.ProcessResultService;

@RestController
@RequestMapping("/api/resultados")
public class ProcessResultController {

	private final ProcessResultService service;

	public ProcessResultController(ProcessResultService service) {

		this.service = service;
	}

	@GetMapping("/processamento/{processamentoId}")
	public ResponseEntity<ProcessResultResponse> buscarPorProcessamento(@PathVariable Long processamentoId) {

		ProcessResultResponse response = service.buscarPorProcessamento(processamentoId);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/pessoa/{pessoaId}")
	public ResponseEntity<List<ProcessResultResponse>> buscarPorPessoa(@PathVariable Long pessoaId) {

		List<ProcessResultResponse> response = service.buscarPorPessoa(pessoaId);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/pessoa/{pessoaId}/ultimo")
	public ResponseEntity<ProcessResultResponse> buscarUltimoProcessamento(@PathVariable Long pessoaId) {

		ProcessResultResponse response = service.buscarUltimoProcessamento(pessoaId);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/pessoa/{pessoaId}/periodo")
	public ResponseEntity<List<ProcessResultResponse>> buscarPorPessoaEPeriodo(@PathVariable Long pessoaId,

			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant dataInicial,

			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant dataFinal) {

		List<ProcessResultResponse> response = service.buscarPorPessoaEPeriodo(pessoaId, dataInicial, dataFinal);

		return ResponseEntity.ok(response);
	}
}