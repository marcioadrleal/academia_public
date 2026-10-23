package com.gym.usercontrol.exception;

public class DeleteException extends Exception {

	private static final long serialVersionUID = 1L;

	public DeleteException(String message) {
		super(message);
	}

	public DeleteException(String message, Throwable cause) {
		super(message, cause);
	}
}