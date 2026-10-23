package com.gym.upload.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gym.upload.dto.request.PessoaRequest;
import com.gym.upload.dto.response.PessoaResponse;
import com.gym.upload.exception.EmailDuplicadoException;
import com.gym.upload.exception.ErroSalvarPessoaException;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.services.PessoaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

	private final PessoaService pessoaService;

	public PessoaController(PessoaService pessoaService) {
		this.pessoaService = pessoaService;
	}

	@PostMapping
	public ResponseEntity<PessoaResponse> cadastrar(@Valid @RequestBody PessoaRequest request)
			throws EmailDuplicadoException, ErroSalvarPessoaException {

		PessoaResponse response = pessoaService.cadastrar(request);

		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/{id}")
	public ResponseEntity<PessoaResponse> buscarPorId(@PathVariable Long id) throws InformacoesNaoEncontradaException {

		PessoaResponse response = pessoaService.buscarPorId(id);

		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/user/{userid}")
	public ResponseEntity<PessoaResponse> buscarPorUserId(@PathVariable("userid") String userId) throws InformacoesNaoEncontradaException{
	  PessoaResponse response = pessoaService.buscarPorUserId(userId);
	  return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	public ResponseEntity<PessoaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PessoaRequest request)
			throws InformacoesNaoEncontradaException, EmailDuplicadoException, ErroSalvarPessoaException {

		PessoaResponse response = pessoaService.atualizar(id, request);

		return ResponseEntity.ok(response);
	}
}