package com.gym.upload.services;

import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gym.upload.domain.Arquivo;
import com.gym.upload.domain.ArquivoProcessamento;
import com.gym.upload.dto.response.ProcessamentoResponse;
import com.gym.upload.dto.response.ResumoResponse;
import com.gym.upload.exception.DownloadException;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.exception.UploadException;
import com.gym.upload.repository.ArquivoProcessamentoRepository;

import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.MinioClient;
import io.minio.RemoveObjectArgs;

@Service
public class ArquivoDownloadService {

	private final ArquivoProcessamentoRepository processamentoRepository;
	private final MinioClient minioClient;

	public ArquivoDownloadService(ArquivoProcessamentoRepository processamentoRepository, MinioClient minioClient) {

		this.processamentoRepository = processamentoRepository;

		this.minioClient = minioClient;
	}

	@Transactional(readOnly = true)
	public ProcessamentoResponse buscarArquivoPendente(Long pessoaId) throws InformacoesNaoEncontradaException {

		ArquivoProcessamento processamento = buscarArquivoPendenteMaisAntigo(pessoaId);

		return new ProcessamentoResponse(processamento.getId(), processamento.getPessoa().getId(),
				processamento.getArquivo().getId(), processamento.getArquivo().getNomeStorage(),
				processamento.getArquivo().getTipoExercicio(), processamento.getPublicado(),
				processamento.getDataEntrada(), processamento.getDataProcessamento());
	}

	@Transactional(readOnly = true)
	public ArquivoProcessamento buscarArquivoPendenteMaisAntigo(Long pessoaId)
			throws InformacoesNaoEncontradaException {

		return processamentoRepository.findFirstByPessoa_IdAndPublicadoFalseOrderByDataEntradaAsc(pessoaId).orElseThrow(
				() -> new InformacoesNaoEncontradaException("Não existe arquivo pendente para a pessoa: " + pessoaId));
	}

	public void realizarDownload(String bucket, String nomeStorage, OutputStream outputStream)
			throws DownloadException {

		try (GetObjectResponse inputStream = minioClient
				.getObject(GetObjectArgs.builder().bucket(bucket).object(nomeStorage).build())) {

			inputStream.transferTo(outputStream);

			outputStream.flush();

		} catch (Exception e) {
			e.printStackTrace();
			throw new DownloadException("Erro ao realizar download do arquivo no MinIO", e);
		}
	}

	@Transactional
	public void darBaixa(Long processamentoId) {

		ArquivoProcessamento processamento = processamentoRepository.findById(processamentoId)
				.orElseThrow(() -> new RuntimeException("Processamento não encontrado: " + processamentoId));

		processamento.setPublicado(true);

		processamento.setDataProcessamento(LocalDateTime.now());

		processamentoRepository.save(processamento);
	}

	@Transactional(readOnly = true)
	public void excluirVideoPorProcessamento(Long processamentoId) throws InformacoesNaoEncontradaException {

		ArquivoProcessamento processamento = processamentoRepository.findById(processamentoId).orElseThrow(
				() -> new InformacoesNaoEncontradaException("Processamento não encontrado: " + processamentoId));

		Arquivo arquivo = processamento.getArquivo();

		if (arquivo == null) {
			throw new InformacoesNaoEncontradaException(
					"Arquivo não encontrado para o processamento: " + processamentoId);
		}

		try {

			minioClient.removeObject(
					RemoveObjectArgs.builder().bucket(arquivo.getBucket()).object(arquivo.getNomeStorage()).build());

		} catch (Exception e) {

			throw new UploadException("Erro ao excluir o arquivo do MinIO: " + arquivo.getNomeStorage(), e);
		}
	}

	public ResumoResponse resumo(Long pessoaId) throws InformacoesNaoEncontradaException {
		return new ResumoResponse(contarPorPessoa(pessoaId), contarPublicadosPorPessoa(pessoaId),
				buscarUltimoRealizado(pessoaId), buscarUltimos5(pessoaId));
	}

	private long contarPorPessoa(Long pessoaId) {

		return processamentoRepository.countByPessoa_Id(pessoaId);
	}

	private long contarPublicadosPorPessoa(Long pessoaId) {

		return processamentoRepository.countByPessoa_IdAndPublicadoTrue(pessoaId);
	}

	private ProcessamentoResponse buscarUltimoRealizado(Long pessoaId) throws InformacoesNaoEncontradaException {

		return processamentoRepository.findFirstByPessoa_IdAndPublicadoTrueOrderByDataProcessamentoDesc(pessoaId)
				.map(this::toResponse).orElseThrow(() -> new InformacoesNaoEncontradaException(
						"Nenhum processamento realizado para a pessoa: " + pessoaId));
	}

	private List<ProcessamentoResponse> buscarUltimos5(Long pessoaId) {

		return processamentoRepository.findTop5ByPessoa_IdAndPublicadoTrueOrderByDataProcessamentoDesc(pessoaId)
				.stream().map(this::toResponse).toList();
	}

	private ProcessamentoResponse toResponse(ArquivoProcessamento processamento) {

		return new ProcessamentoResponse(processamento.getId(), processamento.getPessoa().getId(),
				processamento.getArquivo().getId(), processamento.getArquivo().getNomeOriginal(),
				processamento.getArquivo().getTipoExercicio(), processamento.getPublicado(),
				processamento.getDataEntrada(), processamento.getDataProcessamento());
	}

}