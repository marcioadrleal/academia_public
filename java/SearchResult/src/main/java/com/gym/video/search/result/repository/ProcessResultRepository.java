package com.gym.video.search.result.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gym.video.search.result.domain.ProcessResult;

@Repository
public interface ProcessResultRepository extends MongoRepository<ProcessResult, String> {

	Optional<ProcessResult> findByProcessamentoId(Long processamentoId);

	List<ProcessResult> findByPessoaIdOrderByResultadoDataProcessamentoDesc(Long pessoaId);

	List<ProcessResult> findByPessoaIdAndResultadoDataProcessamentoBetweenOrderByResultadoDataProcessamentoDesc(
			Long pessoaId, Instant dataInicial, Instant dataFinal);

	Optional<ProcessResult> findFirstByPessoaIdOrderByResultadoDataProcessamentoDesc(Long pessoaId);

}