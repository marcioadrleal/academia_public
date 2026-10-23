package com.gym.video.consumer.dto;


import com.fasterxml.jackson.annotation.JsonProperty;

public record ProcessExerciseRequest(

    @JsonProperty("pessoa_id")
    Long pessoaId

) {}
