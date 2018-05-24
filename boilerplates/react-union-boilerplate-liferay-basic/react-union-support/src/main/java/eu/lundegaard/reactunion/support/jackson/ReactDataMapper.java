/*
 * Copyright (C) Lundegaard, s.r.o. 2018 - All Rights Reserved
 * Proprietary and confidential. Unauthorized copying of this file, via any medium is strictly prohibited.
 */
package eu.lundegaard.reactunion.support.jackson;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import eu.lundegaard.reactunion.support.exception.ReactSupportException;

/**
 * @author Roman Srom (roman.srom@lundegaard.eu)
 */
public class ReactDataMapper {

    public String getJson(Object object) {
        ObjectMapper objectMapper = getObjectMapper();
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new ReactSupportException("Serialization to json error", e);
        }
    }

    protected ObjectMapper getObjectMapper() {
        return ObjectMapperFactory.createObjectMapper();
    }
}
