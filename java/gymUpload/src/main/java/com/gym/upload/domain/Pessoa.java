package com.gym.upload.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.gym.upload.enums.SexoEnum;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "pessoa")
public class Pessoa {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "nome", nullable = false, length = 150)
	private String nome;

	@Column(name = "email", nullable = false, unique = true, length = 200)
	private String email;

	@Column(name = "data_nascimento")
	private LocalDate dataNascimento;

	@Enumerated(EnumType.STRING)
	@Column(name = "sexo", length = 20)
	private SexoEnum sexo;

	@Column(name = "telefone", length = 20)
	private String telefone;

	@Column(name = "celular", length = 20)
	private String celular;

	@Column(name = "cep", length = 8)
	private String cep;

	@Column(name = "logradouro", length = 200)
	private String logradouro;

	@Column(name = "numero", length = 20)
	private String numero;

	@Column(name = "complemento", length = 100)
	private String complemento;

	@Column(name = "bairro", length = 100)
	private String bairro;

	@Column(name = "cidade", length = 100)
	private String cidade;

	@Column(name = "uf", length = 2)
	private String uf;

	@Column(name = "ativo", nullable = false)
	private Boolean ativo;

	@Column(name = "data_cadastro", nullable = false)
	private LocalDateTime dataCadastro;

	@Column(name = "data_atualizacao")
	private LocalDateTime dataAtualizacao;
	 
	@Column(name = "userid")
	private String userId;

	@PrePersist
	public void prePersist() {

		if (ativo == null) {
			ativo = true;
		}

		if (dataCadastro == null) {
			dataCadastro = LocalDateTime.now();
		}
	}

	@PreUpdate
	public void preUpdate() {
		dataAtualizacao = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public String getEmail() {
		return email;
	}

	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public SexoEnum getSexo() {
		return sexo;
	}

	public String getTelefone() {
		return telefone;
	}

	public String getCelular() {
		return celular;
	}

	public String getCep() {
		return cep;
	}

	public String getLogradouro() {
		return logradouro;
	}

	public String getNumero() {
		return numero;
	}

	public String getComplemento() {
		return complemento;
	}

	public String getBairro() {
		return bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public String getUf() {
		return uf;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public LocalDateTime getDataCadastro() {
		return dataCadastro;
	}

	public LocalDateTime getDataAtualizacao() {
		return dataAtualizacao;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	public void setSexo(SexoEnum sexo) {
		this.sexo = sexo;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	public void setNumero(String numero) {
		this.numero = numero;
	}

	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	public void setDataCadastro(LocalDateTime dataCadastro) {
		this.dataCadastro = dataCadastro;
	}

	public void setDataAtualizacao(LocalDateTime dataAtualizacao) {

		this.dataAtualizacao = dataAtualizacao;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	
}