package com.gym.usercontrol.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LoginResponse {

	@JsonProperty("access_token")
	private String accessToken;

	@JsonProperty("expires_in")
	private Long expiresIn;

	@JsonProperty("refresh_expires_in")
	private Long refreshExpiresIn;

	@JsonProperty("refresh_token")
	private String refreshToken;

	@JsonProperty("token_type")
	private String tokenType;

	@JsonProperty("not-before-policy")
	private Long notBeforePolicy;

	@JsonProperty("session_state")
	private String sessionState;

	private String scope;

	private String userId;

	private DataPeopleResponse pessoa;

	public DataPeopleResponse getPessoa() {
		return pessoa;
	}

	public void setPessoa(DataPeopleResponse pessoa) {
		this.pessoa = pessoa;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getAccessToken() {
		return accessToken;
	}

	public void setAccessToken(String accessToken) {
		this.accessToken = accessToken;
	}

	public Long getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(Long expiresIn) {
		this.expiresIn = expiresIn;
	}

	public Long getRefreshExpiresIn() {
		return refreshExpiresIn;
	}

	public void setRefreshExpiresIn(Long refreshExpiresIn) {
		this.refreshExpiresIn = refreshExpiresIn;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public String getTokenType() {
		return tokenType;
	}

	public void setTokenType(String tokenType) {
		this.tokenType = tokenType;
	}

	public Long getNotBeforePolicy() {
		return notBeforePolicy;
	}

	public void setNotBeforePolicy(Long notBeforePolicy) {
		this.notBeforePolicy = notBeforePolicy;
	}

	public String getSessionState() {
		return sessionState;
	}

	public void setSessionState(String sessionState) {
		this.sessionState = sessionState;
	}

	public String getScope() {
		return scope;
	}

	public void setScope(String scope) {
		this.scope = scope;
	}
}