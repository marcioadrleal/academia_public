package com.gym.upload.dto.response;

import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

public record FileInformationDto(String fileName, String contentType, Long size, StreamingResponseBody stream) {

}
