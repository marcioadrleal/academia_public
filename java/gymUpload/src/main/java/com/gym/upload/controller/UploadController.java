package com.gym.upload.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.gym.upload.dto.response.UploadResponse;
import com.gym.upload.exception.InformacoesNaoEncontradaException;
import com.gym.upload.services.UploadService;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {

    private final UploadService uploadService;
    
    private static final long MAX_FILE_SIZE = 50L * 1024 * 1024; // 50 MB

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping
    public ResponseEntity<UploadResponse> upload(
            @RequestParam Long pessoaId,
            @RequestParam String tipoExercicio,
            @RequestParam("file") MultipartFile file) throws InformacoesNaoEncontradaException {

        UploadResponse response = uploadService.upload(
                pessoaId,
                tipoExercicio,
                file
        );
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "O arquivo não pode ser maior que 50 MB."
            );
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}