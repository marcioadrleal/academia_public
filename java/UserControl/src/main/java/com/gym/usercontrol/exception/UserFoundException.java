package com.gym.usercontrol.exception;

public class UserFoundException extends Exception {

	private static final long serialVersionUID = 1L;

	public UserFoundException(String message) {
		super(message);
	}

	public UserFoundException(String message, Throwable cause) {
		super(message, cause);
	}
}