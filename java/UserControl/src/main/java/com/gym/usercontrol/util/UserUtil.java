package com.gym.usercontrol.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

public class UserUtil {

	private static UserUtil userUtil;

	public static UserUtil getInstance() {
		return userUtil == null ? new UserUtil() : userUtil;
	};

	private UserUtil() {

	}

	public String extractUserId(String accessToken, ObjectMapper objectMapper) throws Exception {

		if (accessToken == null || accessToken.isBlank()) {

			throw new IllegalArgumentException("Access token não informado.");
		}

		String[] parts = accessToken.split("\\.");

		if (parts.length != 3) {

			throw new IllegalArgumentException("JWT inválido.");
		}

		byte[] decodedPayload = Base64.getUrlDecoder().decode(parts[1]);

		String payload = new String(decodedPayload, StandardCharsets.UTF_8);

		JsonNode json = objectMapper.readTree(payload);

		JsonNode sub = json.get("sub");

		if (sub == null) {

			throw new IllegalArgumentException("Claim sub não encontrado no token.");
		}

		String userId = sub.stringValue();

		if (userId == null || userId.isBlank()) {

			throw new IllegalArgumentException("Claim sub não encontrado no token.");
		}

		return userId;
	}

}
