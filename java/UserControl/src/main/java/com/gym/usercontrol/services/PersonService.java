package com.gym.usercontrol.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.gym.usercontrol.dto.request.DataPeopleRequest;
import com.gym.usercontrol.dto.response.DataPeopleResponse;
import com.gym.usercontrol.exception.PersonServiceIndisponivelException;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@Service
public class PersonService {

	private static final String PERSON_SERVICE = "personService";

	private final RestClient restClient;

	public PersonService(RestClient.Builder builder, @Value("${services.person.url}") String personServiceUrl) {

		this.restClient = builder.baseUrl(personServiceUrl).build();
	}

	@CircuitBreaker(name = PERSON_SERVICE, fallbackMethod = "cadastrarFallback")
	public DataPeopleResponse create(DataPeopleRequest request) {

		return restClient.post().uri("/api/pessoas").body(request).retrieve().body(DataPeopleResponse.class);
	}

	@SuppressWarnings("unused")
	private DataPeopleResponse cadastrarFallback(DataPeopleRequest request, Throwable throwable)
			throws PersonServiceIndisponivelException {

		throw new PersonServiceIndisponivelException("Não foi possível acessar o serviço de pessoas.", throwable);
	}

	@CircuitBreaker(name = PERSON_SERVICE, fallbackMethod = "buscarPorUserIdFallback")
	public DataPeopleResponse buscarPorUserId(String userId) {

		return restClient.get().uri("/api/pessoas/user/{userId}", userId).retrieve().body(DataPeopleResponse.class);
	}

	@SuppressWarnings("unused")
	private DataPeopleResponse buscarPorUserIdFallback(String userId, Throwable throwable)
			throws PersonServiceIndisponivelException {

		throw new PersonServiceIndisponivelException("Não foi possível consultar os dados da pessoa.", throwable);
	}
}