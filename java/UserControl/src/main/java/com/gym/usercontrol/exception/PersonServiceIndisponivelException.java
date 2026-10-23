package com.gym.usercontrol.exception;


public class PersonServiceIndisponivelException
        extends Exception {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public PersonServiceIndisponivelException(
            String message,
            Throwable cause) {

        super(message, cause);
    }
}