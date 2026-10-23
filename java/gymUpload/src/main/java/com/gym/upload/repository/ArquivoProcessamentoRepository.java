package com.gym.upload.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gym.upload.domain.ArquivoProcessamento;

public interface ArquivoProcessamentoRepository extends JpaRepository<ArquivoProcessamento, Long> {

	List<ArquivoProcessamento> findByPessoaId(Long pessoaId);

	List<ArquivoProcessamento> findByDataProcessamentoIsNull();

	Optional<ArquivoProcessamento> findFirstByPessoa_IdAndPublicadoFalseOrderByDataEntradaAsc(Long pessoaId);

	/*
	 * SELECT COUNT(*) FROM arquivo_processamento WHERE pessoa_id = ?
	 */
	long countByPessoa_Id(Long pessoaId);

	/*
	 * SELECT COUNT(*) FROM arquivo_processamento WHERE pessoa_id = ? AND publicado
	 * = true
	 */
	long countByPessoa_IdAndPublicadoTrue(Long pessoaId);

	/*
	 * Último processamento realizado/publicado
	 */
	Optional<ArquivoProcessamento> findFirstByPessoa_IdAndPublicadoTrueOrderByDataProcessamentoDesc(Long pessoaId);

	/*
	 * Últimos 5 processamentos realizados/publicados
	 */
	List<ArquivoProcessamento> findTop5ByPessoa_IdAndPublicadoTrueOrderByDataProcessamentoDesc(Long pessoaId);
}
