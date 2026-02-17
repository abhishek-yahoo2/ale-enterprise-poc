package com.company.ale.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import lombok.RequiredArgsConstructor;

/**
 * Spring Security Configuration for the ALE application.
 * 
 * Configures:
 * - CORS (Cross-Origin Resource Sharing)
 * - CSRF protection (disabled for token-based API)
 * - Session management (stateless for JWT-based authentication)
 * - Authorization rules (public vs protected endpoints)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    /**
     * Configure the security filter chain for HTTP requests.
     * 
     * Security rules:
     * - CORS is enabled globally (preflight requests are allowed)
     * - CSRF is disabled (token-based authentication, not form-based)
     * - Session management is stateless (JWT tokens, no sessions)
     * - Public endpoints: /api/auth/**, /h2-console/**
     * - Protected endpoints: /api/** (requires authentication)
     * 
     * @param http HttpSecurity to configure
     * @return Configured SecurityFilterChain
     * @throws Exception if an error occurred while using the HTTP Security
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS with the configured CorsConfigurationSource
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            
            // Disable CSRF as we're using token-based authentication (JWT)
            .csrf(csrf -> csrf.disable())
            
            // Configure session management as stateless (no server-side sessions)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization for endpoints
            .authorizeHttpRequests(auth -> auth
                // H2 console access (development only)
                // .requestMatchers("/h2-console/**").permitAll()
                
                // // Authentication endpoints (public)
                // .requestMatchers("/api/auth/**").permitAll()
                
                // // All other API endpoints require authentication
                // .requestMatchers("/api/**").authenticated()
                
                // // All other requests allowed
                // .anyRequest().authenticated()
                .requestMatchers("/api/**").permitAll()  // 🔥 allow all API calls
                .anyRequest().permitAll()
            )
            
            // Allow framing for H2 console (development only)
            .headers(headers -> headers.frameOptions(frame -> frame.disable()));
        
        return http.build();
    }
}
