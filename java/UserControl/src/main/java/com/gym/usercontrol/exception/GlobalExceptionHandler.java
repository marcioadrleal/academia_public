package com.gym.usercontrol.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.RestClientResponseException;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RestClientResponseException.class)
	public ResponseEntity<ErrorResponse> handleRestClientResponseException(RestClientResponseException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), ex.getStatusCode().value(),
				"Erro na comunicação com serviço externo", ex.getResponseBodyAsString());

		return ResponseEntity.status(ex.getStatusCode()).body(error);
	}

	@ExceptionHandler(CreateException.class)
	public ResponseEntity<ErrorResponse> handleGenericException(CreateException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
	
	@ExceptionHandler(InvalidLoginException.class)
	public ResponseEntity<ErrorResponse> handleGenericException(InvalidLoginException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.UNAUTHORIZED.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
	}

	@ExceptionHandler(PersonServiceIndisponivelException.class)
	public ResponseEntity<ErrorResponse> handleGenericException(PersonServiceIndisponivelException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}

	@ExceptionHandler(DeleteException.class)
	public ResponseEntity<ErrorResponse> handleGenericException(DeleteException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}

	@ExceptionHandler(UserFoundException.class)
	public ResponseEntity<ErrorResponse> handleGenericException(UserFoundException ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {

		ErrorResponse error = new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(),
				"Erro interno", ex.getMessage());

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
	}
}