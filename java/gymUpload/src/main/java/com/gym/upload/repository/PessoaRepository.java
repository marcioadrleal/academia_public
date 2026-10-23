package com.gym.upload.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gym.upload.domain.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

	Optional<Pessoa> findByEmail(String email);

	boolean existsByEmail(String email);

	boolean existsByEmailAndIdNot(String email, Long id);

	Optional<Pessoa> findByUserId(String userId);

}