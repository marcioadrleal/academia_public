package com.gym.usercontrol.controller;

import java.net.URI;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gym.usercontrol.dto.request.ChangePasswordRequest;
import com.gym.usercontrol.dto.request.NewLoginRequest;
import com.gym.usercontrol.dto.response.NewLoginResponse;
import com.gym.usercontrol.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping
	public ResponseEntity<NewLoginResponse> create(@Valid @RequestBody NewLoginRequest request) throws Exception {

		NewLoginResponse response = userService.create(request);

		return ResponseEntity.created(URI.create("/api/users" + response.user().userId())).body(response);
	}

	@PutMapping("/password")
	public ResponseEntity<Void> changePassword(@RequestHeader(HttpHeaders.AUTHORIZATION) String token,

			@Valid @RequestBody ChangePasswordRequest request) throws Exception {

		userService.changePassword(token, request);

		return ResponseEntity.noContent().build();
	}

}