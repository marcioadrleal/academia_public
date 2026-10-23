package com.gym.usercontrol.exception;

public class InvalidCurrentPasswordException  extends Exception {

	private static final long serialVersionUID = 1L;

	public InvalidCurrentPasswordException (String message) {
		super(message);
	}

	public InvalidCurrentPasswordException (String message, Throwable cause) {
		super(message, cause);
	}
}