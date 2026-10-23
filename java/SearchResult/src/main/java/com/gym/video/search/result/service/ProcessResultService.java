package com.gym.video.search.result.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import com.gym.video.search.result.dto.ProcessResultResponse;
import com.gym.video.search.result.mapper.ProcessResultMapper;
import com.gym.video.search.result.repository.ProcessResultRepository;

@Service
public class ProcessResultService {

	private final ProcessResultRepository repository;
	private final ProcessResultMapper mapper;

	public ProcessResultService(ProcessResultRepository repository, ProcessResultMapper mapper) {

		this.repository = repository;
		this.mapper = mapper;
	}

	public ProcessResultResponse buscarUltimoProcessamento(Long pessoaId) {

		return repository.findFirstByPessoaIdOrderByResultadoDataProcessamentoDesc(pessoaId).map(mapper::toResponse)
				.orElseThrow(() -> new RuntimeException("Nenhum processamento encontrado para a pessoa: " + pessoaId));
	}

	public ProcessResultResponse buscarPorProcessamento(Long processamentoId) {

		return repository.findByProcessamentoId(processamentoId).map(mapper::toResponse).orElseThrow(
				() -> new RuntimeException("Resultado não encontrado para o processamento: " + processamentoId));
	}

	public List<ProcessResultResponse> buscarPorPessoa(Long pessoaId) {

		return repository.findByPessoaIdOrderByResultadoDataProcessamentoDesc(pessoaId).stream().map(mapper::toResponse)
				.toList();
	}

	public List<ProcessResultResponse> buscarPorPessoaEPeriodo(Long pessoaId, Instant dataInicial, Instant dataFinal) {

		return repository
				.findByPessoaIdAndResultadoDataProcessamentoBetweenOrderByResultadoDataProcessamentoDesc(pessoaId,
						dataInicial, dataFinal)
				.stream().map(mapper::toResponse).toList();
	}
	
	
}