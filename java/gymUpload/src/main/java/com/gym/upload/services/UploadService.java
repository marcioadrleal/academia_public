package com.gym.upload.services;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.gym.upload.domain.Arquivo;
import com.gym.upload.domain.ArquivoProcessamento;
import com.gym.upload.domain.Pessoa;
import com.gym.upload.dto.event.VideoUploadedEvent;
import com.gym.upload.dto.response.UploadResponse;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.exception.UploadException;
import com.gym.upload.repository.ArquivoProcessamentoRepository;
import com.gym.upload.repository.ArquivoRepository;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.ErrorResponseException;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.InvalidResponseException;
import io.minio.errors.ServerException;
import io.minio.errors.XmlParserException;

@Service
public class UploadService {

	private final ArquivoRepository arquivoRepository;
	private final ArquivoProcessamentoRepository arquivoProcessamentoRepository;
	private final PessoaService pessoaService;
	private final MinioClient minioClient;
	private final VideoUploadedProducer videoUploadProducer;

	@Value("${minio.bucket}")
	private String bucket;

	public UploadService(ArquivoRepository arquivoRepository,
			ArquivoProcessamentoRepository arquivoProcessamentoRepository, PessoaService pessoaService,
			MinioClient minioClient, VideoUploadedProducer videoUploadProducer) {

		this.arquivoRepository = arquivoRepository;
		this.arquivoProcessamentoRepository = arquivoProcessamentoRepository;
		this.pessoaService = pessoaService;
		this.minioClient = minioClient;
		this.videoUploadProducer = videoUploadProducer;
	}

	private void gerarArquivo(MultipartFile file, String nomeStorage) throws Exception {
		validarArquivo(file);
		criarBucketCasoNaoExista();
		salvarNoMinio(file, nomeStorage);
	}

	@Transactional
	public UploadResponse upload(Long pessoaId, String tipoExercicio, MultipartFile file)
			throws InformacoesNaoEncontradaException {

		Pessoa pessoa = pessoaService.buscarEntidadePorId(pessoaId);
		String nomeStorage = gerarNomeStorage(file);
		try {
			Arquivo arquivo = new Arquivo();
			arquivo.setPessoa(pessoa);
			arquivo.setNomeOriginal(file.getOriginalFilename());
			arquivo.setNomeStorage(nomeStorage);
			arquivo.setBucket(bucket);
			arquivo.setTipoExercicio(tipoExercicio);
			arquivo.setContentType(file.getContentType());
			arquivo.setTamanho(file.getSize());

			Arquivo arquivoSalvo = arquivoRepository.save(arquivo);

			ArquivoProcessamento processamento = new ArquivoProcessamento();

			processamento.setPessoa(pessoa);
			processamento.setArquivo(arquivoSalvo);

			// ainda não foi processado/publicado
			processamento.setDataProcessamento(null);

			// ainda não foi dado baixa
			processamento.setPublicado(false);

			ArquivoProcessamento processamentoSalvo = arquivoProcessamentoRepository.save(processamento);
			gerarArquivo(file, arquivo.getNomeStorage());
			videoUploadProducer.publicar(evento(processamentoSalvo));
			return new UploadResponse(arquivoSalvo.getId(), pessoa.getId(), arquivoSalvo.getNomeOriginal(),
					arquivoSalvo.getNomeStorage(), arquivoSalvo.getBucket(), arquivoSalvo.getTipoExercicio(),
					arquivoSalvo.getContentType(), arquivoSalvo.getTamanho(), processamentoSalvo.getPublicado(),
					processamentoSalvo.getDataEntrada(), processamentoSalvo.getDataProcessamento());

		} catch (Exception e) {

			throw new UploadException("Erro ao realizar upload do arquivo", e);
		}
	}

	private VideoUploadedEvent evento(ArquivoProcessamento arquivo) {
		return new VideoUploadedEvent(arquivo.getPessoa().getId(), arquivo.getArquivo().getId(), arquivo.getId(),
				arquivo.getArquivo().getTipoExercicio());
	}

	private void salvarNoMinio(MultipartFile file, String nomeStorage) throws Exception {

		minioClient.putObject(PutObjectArgs.builder().bucket(bucket).object(nomeStorage)
				.stream(file.getInputStream(), file.getSize(), -1).contentType(file.getContentType()).build());
	}

	private void criarBucketCasoNaoExista() throws InvalidKeyException, ErrorResponseException,
			InsufficientDataException, InternalException, InvalidResponseException, NoSuchAlgorithmException,
			ServerException, XmlParserException, IllegalArgumentException, IOException {

		boolean existe = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());

		if (!existe) {

			minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
		}
	}

	private String gerarNomeStorage(MultipartFile file) {

		String nomeOriginal = file.getOriginalFilename();

		String extensao = "";

		if (nomeOriginal != null && nomeOriginal.contains(".")) {

			extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
		}

		return UUID.randomUUID() + extensao;
	}

	private void validarArquivo(MultipartFile file) {

		if (file == null || file.isEmpty()) {
			throw new RuntimeException("O arquivo não pode estar vazio.");
		}
	}

	
}