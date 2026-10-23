package com.gym.usercontrol.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.gym.usercontrol.dto.request.LoginRequest;
import com.gym.usercontrol.dto.response.DataPeopleResponse;
import com.gym.usercontrol.dto.response.LoginResponse;
import com.gym.usercontrol.exception.InvalidLoginException;
import com.gym.usercontrol.util.UserUtil;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class AuthService {

	private final RestClient restClient;
	private final String realm;
	private final String clientId;
	private final String clientSecret;
	private final ObjectMapper objectMapper;
	private final PersonService personService;

	public AuthService(RestClient.Builder builder, ObjectMapper objectMapper, PersonService personService,
			@Value("${keycloak.admin.server-url}") String serverUrl,

			@Value("${keycloak.admin.realm}") String realm,

			@Value("${keycloak.admin.client-id}") String clientId,

			@Value("${keycloak.admin.client-secret}") String clientSecret) {

		this.restClient = builder.baseUrl(serverUrl).build();
		this.personService = personService;
		this.realm = realm;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.objectMapper = objectMapper;
	}

	public LoginResponse login(LoginRequest request) throws Exception {

		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

		form.add("grant_type", "password");
		form.add("client_id", clientId);
		form.add("client_secret", clientSecret);
		form.add("username", request.username());
		form.add("password", request.password());

		try {

			LoginResponse login = restClient.post().uri("/realms/{realm}/protocol/openid-connect/token", realm)
					.contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(LoginResponse.class);

			String userId = UserUtil.getInstance().extractUserId(login.getAccessToken(), objectMapper);
			DataPeopleResponse personResponse = personService.buscarPorUserId(userId);
			login.setPessoa(personResponse);
			return login;
		} catch (RestClientResponseException ex) {
			throw new InvalidLoginException("Usuário ou senha inválidos.", ex);
		}
	}

	public LoginResponse validarOuRenovarToken(String accessToken, String refreshToken) throws Exception {

		if (accessToken != null && !accessToken.isBlank() && tokenAtivo(accessToken)) {

			LoginResponse response = new LoginResponse();

			response.setAccessToken(accessToken);

			response.setRefreshToken(refreshToken);

			String userId = UserUtil.getInstance().extractUserId(accessToken,objectMapper);

			DataPeopleResponse pessoa = personService.buscarPorUserId(userId);

			response.setPessoa(pessoa);

			return response;
		}

		return renovarToken(refreshToken);
	}

	private LoginResponse renovarToken(String refreshToken) throws Exception {

		if (refreshToken == null || refreshToken.isBlank()) {

			throw new InvalidLoginException("Refresh token não informado.");
		}

		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

		form.add("grant_type", "refresh_token");

		form.add("client_id", clientId);

		form.add("client_secret", clientSecret);

		form.add("refresh_token", refreshToken);

		try {

			LoginResponse login = restClient.post().uri("/realms/{realm}/protocol/openid-connect/token", realm)
					.contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(LoginResponse.class);

			if (login == null) {

				throw new InvalidLoginException("Não foi possível renovar o token.");
			}

			String userId = UserUtil.getInstance().extractUserId(login.getAccessToken(),objectMapper);

			DataPeopleResponse pessoa = personService.buscarPorUserId(userId);

			login.setPessoa(pessoa);

			return login;

		} catch (RestClientResponseException ex) {

			throw new InvalidLoginException("Sessão expirada. Faça login novamente.", ex);
		}
	}

	private boolean tokenAtivo(String accessToken) {

		MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

		form.add("token", accessToken);

		form.add("client_id", clientId);

		form.add("client_secret", clientSecret);

		try {

			JsonNode response = restClient.post().uri("/realms/{realm}/protocol/openid-connect/token/introspect", realm)
					.contentType(MediaType.APPLICATION_FORM_URLENCODED).body(form).retrieve().body(JsonNode.class);

			if (response == null) {
				return false;
			}

			JsonNode active = response.get("active");

			return active != null && active.booleanValue();

		} catch (Exception ex) {

			return false;
		}
	}
}
