package com.gym.upload.enums;

public enum SexoEnum {

	MASCULINO("Masculino"), FEMININO("Feminino"), INTERSEXO("Intersexo"), NAO_INFORMADO("Não informado");

	private final String descricao;

	SexoEnum(String descricao) {
		this.descricao = descricao;
	}

	public String getDescricao() {
		return descricao;
	}
}