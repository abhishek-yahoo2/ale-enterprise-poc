package com.company.ale.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS Configuration for the ALE application.
 * 
 * Defines cross-origin resource sharing policies to allow frontend applications
 * to communicate with this backend API from allowed origins.
 * 
 * Configuration is read from application.properties:
 * - ale.cors.allowed-origins: Comma-separated list of allowed origins
 * - ale.cors.allowed-methods: HTTP methods to allow (default: GET, POST, PUT, DELETE, OPTIONS)
 * - ale.cors.allowed-headers: Headers to allow (default: *)
 * - ale.cors.allow-credentials: Whether to allow credentials (default: true)
 * - ale.cors.max-age: Max age of preflight request cache in seconds (default: 3600)
 */
@Configuration
public class CorsConfig {

    @Value("${ale.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Value("${ale.cors.allowed-methods:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${ale.cors.allowed-headers:*}")
    private String allowedHeaders;

    @Value("${ale.cors.allow-credentials:true}")
    private boolean allowCredentials;

    @Value("${ale.cors.max-age:3600}")
    private long maxAge;

    /**
     * Creates the CORS configuration bean for Spring Security.
     * 
     * @return CorsConfigurationSource configured with allowed origins, methods, and headers
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Parse allowed origins from comma-separated string
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);
        
        // Parse allowed methods from comma-separated string
        List<String> methods = Arrays.asList(allowedMethods.split(","));
        configuration.setAllowedMethods(methods);
        
        // Set allowed headers
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders.split(",")));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(allowCredentials);
        
        // Set max age for preflight request cache in seconds
        configuration.setMaxAge(maxAge);
        
        // Expose commonly used response headers
        configuration.setExposedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "X-Correlation-Id",
            "X-Total-Count",
            "X-Page-Number",
            "X-Page-Size"
        ));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply CORS configuration to all API endpoints
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
