package com.gym.upload.exception;

public class UploadException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public UploadException(String message) {
		super(message);
	}

	public UploadException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}