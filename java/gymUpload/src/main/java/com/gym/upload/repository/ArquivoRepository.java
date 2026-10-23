package com.gym.upload.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gym.upload.domain.Arquivo;

public interface ArquivoRepository extends JpaRepository<Arquivo, Long> {

    List<Arquivo> findByPessoaId(Long pessoaId);
}
