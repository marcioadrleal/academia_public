package com.gym.upload.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gym.upload.domain.Pessoa;
import com.gym.upload.dto.request.PessoaRequest;
import com.gym.upload.dto.response.PessoaResponse;
import com.gym.upload.exception.EmailDuplicadoException;
import com.gym.upload.exception.ErroSalvarPessoaException;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.repository.PessoaRepository;

@Service
public class PessoaService {

	private final PessoaRepository pessoaRepository;

	PessoaService(PessoaRepository pessoaRepository) {
		this.pessoaRepository = pessoaRepository;
	}

	private void validarEmailAtualizacao(Pessoa pessoa, String email) throws EmailDuplicadoException {

		if (email.equalsIgnoreCase(pessoa.getEmail())) {
			return;
		}

		if (pessoaRepository.existsByEmailAndIdNot(email, pessoa.getId())) {

			throw new EmailDuplicadoException("Já existe uma pessoa cadastrada com este e-mail.");
		}
	}

	@Transactional
	public PessoaResponse atualizar(Long id, PessoaRequest request)
			throws InformacoesNaoEncontradaException, EmailDuplicadoException, ErroSalvarPessoaException {

		Pessoa pessoa = pessoaRepository.findById(id)
				.orElseThrow(() -> new InformacoesNaoEncontradaException("Pessoa não encontrada."));

		validarEmailAtualizacao(pessoa, request.email());

		try {

			pessoa.setNome(request.nome());
			pessoa.setEmail(request.email());
			pessoa.setDataNascimento(request.dataNascimento());
			pessoa.setSexo(request.sexo());
			pessoa.setTelefone(request.telefone());
			pessoa.setCelular(request.celular());
			pessoa.setCep(request.cep());
			pessoa.setLogradouro(request.logradouro());
			pessoa.setNumero(request.numero());
			pessoa.setComplemento(request.complemento());
			pessoa.setBairro(request.bairro());
			pessoa.setCidade(request.cidade());

			if (request.uf() != null) {
				pessoa.setUf(request.uf().toUpperCase());
			}

			Pessoa pessoaSalva = pessoaRepository.save(pessoa);

			return converterParaResponse(pessoaSalva);

		} catch (Exception e) {

			throw new ErroSalvarPessoaException("Erro ao atualizar pessoa.", e);
		}
	}

	@Transactional
	public PessoaResponse cadastrar(PessoaRequest request) throws EmailDuplicadoException, ErroSalvarPessoaException {

		if (pessoaRepository.existsByEmail(request.email())) {
			throw new EmailDuplicadoException("Já existe uma pessoa cadastrada com este e-mail.");
		}

		Pessoa pessoa = new Pessoa();

		try {

			pessoa.setNome(request.nome());
			pessoa.setEmail(request.email());
			pessoa.setDataNascimento(request.dataNascimento());
			pessoa.setSexo(request.sexo());
			pessoa.setTelefone(request.telefone());
			pessoa.setCelular(request.celular());
			pessoa.setCep(request.cep());
			pessoa.setLogradouro(request.logradouro());
			pessoa.setNumero(request.numero());
			pessoa.setComplemento(request.complemento());
			pessoa.setBairro(request.bairro());
			pessoa.setCidade(request.cidade());
			pessoa.setUserId(request.userId());

			if (request.uf() != null) {
				pessoa.setUf(request.uf().toUpperCase());
			}

			Pessoa pessoaSalva = pessoaRepository.save(pessoa);

			return converterParaResponse(pessoaSalva);

		} catch (Exception e) {

			throw new ErroSalvarPessoaException("Erro ao incluir pessoa.", e);
		}
	}

	@Transactional(readOnly = true)
	public PessoaResponse buscarPorId(Long id) throws InformacoesNaoEncontradaException {

		Pessoa pessoa = pessoaRepository.findById(id)
				.orElseThrow(() -> new InformacoesNaoEncontradaException("Pessoa não encontrada: " + id));

		return converterParaResponse(pessoa);
	}

	@Transactional(readOnly = true)
	public PessoaResponse buscarPorUserId(String userId) throws InformacoesNaoEncontradaException {
		Pessoa pessoa = pessoaRepository.findByUserId(userId)
				.orElseThrow(() -> new InformacoesNaoEncontradaException("Usuário não encontrado"));
		return converterParaResponse(pessoa);
	}

	@Transactional(readOnly = true)
	public Pessoa buscarEntidadePorId(Long id) throws InformacoesNaoEncontradaException {

		return pessoaRepository.findById(id)
				.orElseThrow(() -> new InformacoesNaoEncontradaException("Pessoa não encontrada: " + id));
	}

	private PessoaResponse converterParaResponse(Pessoa pessoa) {

		return new PessoaResponse(pessoa.getId(), pessoa.getNome(), pessoa.getEmail(), pessoa.getDataNascimento(),
				pessoa.getSexo(), pessoa.getTelefone(), pessoa.getCelular(), pessoa.getCep(), pessoa.getLogradouro(),
				pessoa.getNumero(), pessoa.getComplemento(), pessoa.getBairro(), pessoa.getCidade(), pessoa.getUf(),
				pessoa.getAtivo(), pessoa.getDataCadastro(), pessoa.getDataAtualizacao());
	}
}