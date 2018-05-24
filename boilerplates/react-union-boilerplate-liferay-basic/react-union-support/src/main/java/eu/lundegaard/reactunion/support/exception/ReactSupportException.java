/*
 * Copyright (C) Lundegaard, s.r.o. 2018 - All Rights Reserved
 * Proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
 */
package eu.lundegaard.reactunion.support.exception;

/**
 * General exception for error getting from React Support library.
 *
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class ReactSupportException extends RuntimeException {

    public ReactSupportException(String message) {
        super(message);
    }

    public ReactSupportException(String message, Throwable cause) {
        super(message, cause);
    }

    public ReactSupportException(Throwable cause) {
        super(cause);
    }
}
