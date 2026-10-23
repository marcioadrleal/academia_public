package com.gym.upload.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private ApiError montarApiError(
            Exception ex,
            HttpServletRequest request,
            HttpStatus status) {

        return new ApiError(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage(),
                request.getRequestURI()
        );
    }

    @ExceptionHandler(DownloadException.class)
    public ResponseEntity<ApiError> handleDownload(
            DownloadException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(InformacoesNaoEncontradaException.class)
    public ResponseEntity<ApiError> handleInformacaoNaoEncontrada(
            InformacoesNaoEncontradaException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(ArquivoInvalidoException.class)
    public ResponseEntity<ApiError> handleArquivoInvalido(
            ArquivoInvalidoException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.BAD_REQUEST;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(UploadException.class)
    public ResponseEntity<ApiError> handleUpload(
            UploadException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(EmailDuplicadoException.class)
    public ResponseEntity<ApiError> handleEmailDuplicado(
            EmailDuplicadoException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(ErroSalvarPessoaException.class)
    public ResponseEntity<ApiError> handleErroSalvarPessoa(
            ErroSalvarPessoaException ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        return ResponseEntity
                .status(status)
                .body(montarApiError(ex, request, status));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(
            Exception ex,
            HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        ApiError erro = new ApiError(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                "Erro interno do servidor.",
                request.getRequestURI()
        );

        return ResponseEntity
                .status(status)
                .body(erro);
    }
}