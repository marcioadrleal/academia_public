package com.gym.usercontrol.exception;

public class CreateException extends Exception {

	private static final long serialVersionUID = 1L;

	public CreateException(String message) {
		super(message);
	}

	public CreateException(String message, Throwable cause) {
		super(message, cause);
	}
}