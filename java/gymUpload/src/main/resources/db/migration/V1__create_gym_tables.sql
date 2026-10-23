CREATE TABLE pessoa (

    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,

    data_nascimento DATE,
    sexo VARCHAR(20),

    telefone VARCHAR(20),
    celular VARCHAR(20),

    cep VARCHAR(8),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf VARCHAR(2),

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP ,
    userid varchar(100) NOT NULL

);


CREATE TABLE arquivo (
    id BIGSERIAL PRIMARY KEY,

    pessoa_id BIGINT NOT NULL,

    nome_original VARCHAR(255) NOT NULL,
    nome_storage VARCHAR(255) NOT NULL,

    bucket VARCHAR(100) NOT NULL,

    tipo_exercicio VARCHAR(100) NOT NULL,

    content_type VARCHAR(100),

    tamanho BIGINT,

    data_upload TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_arquivo_pessoa
        FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id)
);


CREATE TABLE arquivo_processamento (
    id BIGSERIAL PRIMARY KEY,

    pessoa_id BIGINT NOT NULL,
    arquivo_id BIGINT NOT NULL,

    publicado BOOLEAN NOT NULL DEFAULT FALSE,

    data_entrada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_processamento TIMESTAMP NULL,

    CONSTRAINT fk_processamento_pessoa
        FOREIGN KEY (pessoa_id)
        REFERENCES pessoa(id),

    CONSTRAINT fk_processamento_arquivo
        FOREIGN KEY (arquivo_id)
        REFERENCES arquivo(id),

    CONSTRAINT uk_processamento_arquivo
        UNIQUE (arquivo_id)
);


CREATE INDEX idx_arquivo_pessoa
    ON arquivo(pessoa_id);


CREATE INDEX idx_arquivo_tipo_exercicio
    ON arquivo(tipo_exercicio);


CREATE INDEX idx_processamento_pessoa
    ON arquivo_processamento(pessoa_id);


CREATE INDEX idx_processamento_data_processamento
    ON arquivo_processamento(data_processamento);