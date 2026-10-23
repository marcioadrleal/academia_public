package com.gym.usercontrol.services;

import java.util.List;

import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.gym.usercontrol.dto.request.ChangePasswordRequest;
import com.gym.usercontrol.dto.request.DataPeopleRequest;
import com.gym.usercontrol.dto.request.NewLoginRequest;
import com.gym.usercontrol.dto.request.NewUserLoginRequest;
import com.gym.usercontrol.dto.response.DataPeopleResponse;
import com.gym.usercontrol.dto.response.NewLoginResponse;
import com.gym.usercontrol.dto.response.UserResponse;
import com.gym.usercontrol.exception.CreateException;
import com.gym.usercontrol.exception.DeleteException;
import com.gym.usercontrol.exception.InvalidCurrentPasswordException;
import com.gym.usercontrol.exception.UserFoundException;
import com.gym.usercontrol.util.UserUtil;

import jakarta.ws.rs.NotAuthorizedException;
import jakarta.ws.rs.core.Response;
import tools.jackson.databind.ObjectMapper;

@Service
public class UserService {

	private static final String DEFAULT_ROLE = "USER";

	private final Keycloak keycloak;
	private final String realm;
	private final String serverUrl;
	private final String clientId;
	private final String clientSecret;
	private final PersonService personService;
	private final ObjectMapper objectMapper;

	public UserService(Keycloak keycloak, @Value("${keycloak.admin.realm}") String realm,
			@Value("${keycloak.admin.server-url}") String serverUrl,
			@Value("${keycloak.admin.client-id}") String clientId,
			@Value("${keycloak.admin.client-secret}") String clientSecret, PersonService personService,
			ObjectMapper objectMapper) {

		this.keycloak = keycloak;
		this.realm = realm;
		this.serverUrl = serverUrl;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.personService = personService;
		this.objectMapper = objectMapper;
	}

	public NewLoginResponse create(NewLoginRequest request)
			throws UserFoundException, DeleteException, CreateException {

		String userId = null;

		NewUserLoginRequest login = request.newUser();
		DataPeopleRequest person = request.dataPerson();

		validateUserExists(login.userName());

		try {

			userId = createKeycloakUser(login, person);

			definePassword(userId, login.password());

			assignDefaultUserRole(userId);

			DataPeopleResponse personResponse = personService.create(newPerson(person, userId));

			return new NewLoginResponse(new UserResponse(userId, login.userName()), personResponse);

		} catch (Exception e) {

			deleteUser(userId);

			throw new CreateException(e.getMessage(), e);
		}
	}

	public void changePassword(String token , ChangePasswordRequest request) throws Exception {

		String userId = UserUtil.getInstance().extractUserId(token, objectMapper);

		UserRepresentation user = getUser(userId);

		String username = user.getUsername();

		validateCurrentPassword(username, request.senhaAtual());

		validateNewPassword(request);

		definePassword(userId, request.novaSenha());
	}

	private UserRepresentation getUser(String userId) {

		if (userId == null || userId.isBlank()) {

			throw new IllegalArgumentException("Identificador do usuário não informado.");
		}

		try {

			UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();

			if (user == null) {

				throw new IllegalArgumentException("Usuário não encontrado.");
			}

			return user;

		} catch (Exception exception) {

			throw new IllegalArgumentException("Usuário não encontrado.", exception);
		}
	}

	private void validateCurrentPassword(String username, String password) throws InvalidCurrentPasswordException {

		if (password == null || password.isBlank()) {

			throw new InvalidCurrentPasswordException("Informe a senha atual.");
		}

		try (Keycloak userKeycloak = KeycloakBuilder.builder().serverUrl(serverUrl).realm(realm).clientId(clientId)
				.clientSecret(clientSecret).username(username).password(password).grantType("password").build()) {

			userKeycloak.tokenManager().getAccessToken();

		} catch (NotAuthorizedException exception) {

			throw new InvalidCurrentPasswordException("Senha atual inválida.", exception);

		} catch (Exception exception) {

			throw new InvalidCurrentPasswordException("Não foi possível validar a senha atual.", exception);
		}
	}

	private void validateNewPassword(ChangePasswordRequest request) throws InvalidCurrentPasswordException {

		String senhaAtual = request.senhaAtual();

		String novaSenha = request.novaSenha();

		if (novaSenha == null || novaSenha.isBlank()) {

			throw new InvalidCurrentPasswordException("Informe a nova senha.");
		}

		if (novaSenha.equals(senhaAtual)) {

			throw new InvalidCurrentPasswordException("A nova senha deve ser diferente da senha atual.");
		}
	}

	private void deleteUser(String userId) throws DeleteException {

		compensateUserCreation(userId);
	}

	private DataPeopleRequest newPerson(DataPeopleRequest request, String userId) {

		return new DataPeopleRequest(request.nome(), request.email(), request.dataNascimento(), request.sexo(),
				request.telefone(), request.celular(), request.cep(), request.logradouro(), request.numero(),
				request.complemento(), request.bairro(), request.cidade(), request.uf(), userId);
	}

	private void validateUserExists(String userName) throws UserFoundException {

		var users = keycloak.realm(realm).users().search(userName, true);

		if (!users.isEmpty()) {

			throw new UserFoundException("Já existe um usuário cadastrado com este login.");
		}
	}

	private String createKeycloakUser(NewUserLoginRequest login, DataPeopleRequest person) throws CreateException {

		UserRepresentation user = new UserRepresentation();

		user.setUsername(login.userName());

		user.setEmail(person.email());

		String nomeCompleto = person.nome().trim();

		String[] partes = nomeCompleto.split("\\s+", 2);

		user.setFirstName(partes[0]);

		if (partes.length > 1) {

			user.setLastName(partes[1]);

		} else {

			user.setLastName(partes[0]);
		}

		user.setEnabled(true);

		user.setEmailVerified(true);

		user.setRequiredActions(List.of());

		try (Response response = keycloak.realm(realm).users().create(user)) {

			if (response.getStatus() != Response.Status.CREATED.getStatusCode()) {

				throw new CreateException("Erro ao criar usuário no Keycloak. HTTP " + response.getStatus());
			}

			return CreatedResponseUtil.getCreatedId(response);
		}
	}

	private void definePassword(String userId, String password) {

		CredentialRepresentation credential = new CredentialRepresentation();

		credential.setType(CredentialRepresentation.PASSWORD);

		credential.setValue(password);

		credential.setTemporary(false);

		keycloak.realm(realm).users().get(userId).resetPassword(credential);
	}

	private void assignDefaultUserRole(String userId) {

		var role = keycloak.realm(realm).roles().get(DEFAULT_ROLE).toRepresentation();

		keycloak.realm(realm).users().get(userId).roles().realmLevel().add(List.of(role));
	}

	private void compensateUserCreation(String userId) throws DeleteException {

		if (userId == null) {
			return;
		}

		try {

			keycloak.realm(realm).users().delete(userId);

		} catch (Exception exception) {

			throw new DeleteException("Erro ao Excluir Usuário " + userId, exception);
		}
	}
}