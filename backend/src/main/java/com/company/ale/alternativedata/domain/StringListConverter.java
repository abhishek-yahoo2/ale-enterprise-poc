package com.company.ale.alternativedata.domain;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Converter for storing List<String> as comma-separated string in database
 */
@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {
    
    private static final String SPLIT_CHAR = ",";
    
    @Override
    public String convertToDatabaseColumn(List<String> attribute) {
        if (attribute == null || attribute.isEmpty()) {
            return "";
        }
        return String.join(SPLIT_CHAR, attribute);
    }
    
    @Override
    public List<String> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        return new ArrayList<>(Arrays.asList(dbData.split(SPLIT_CHAR)));
    }
}
