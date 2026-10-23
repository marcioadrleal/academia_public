package com.gym.video.gateway.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.gym.video.gateway.converter.KeycloakRealmRoleConverter;

@Configuration
public class SecurityConfig {

	private final KeycloakRealmRoleConverter roleConverter;

	public SecurityConfig(KeycloakRealmRoleConverter roleConverter) {
		this.roleConverter = roleConverter;
	}

	@Bean
	public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

		JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();

		jwtConverter.setJwtGrantedAuthoritiesConverter(roleConverter);

		return http

				.csrf(ServerHttpSecurity.CsrfSpec::disable)

				// Habilita CORS no Spring Security
				.cors(withDefaults())

				.authorizeExchange(exchange -> exchange

						// ========================================
						// CORS / PREFLIGHT
						// ========================================

						.pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

						// ========================================
						// PÚBLICOS
						// ========================================

						.pathMatchers(HttpMethod.POST, "/api/users", "/api/auth/login", "/api/auth/validate")
						.permitAll()

						// ========================================
						// PESSOAS
						// ========================================

						// USER ou ADMIN podem atualizar
						.pathMatchers(HttpMethod.PUT, "/api/pessoas/**" , "/api/users/**").hasAnyRole("USER", "ADMIN")

						// USER ou ADMIN podem consultar
						.pathMatchers(HttpMethod.GET, "/api/pessoas/**", "/api/resultados/**")
						.hasAnyRole("USER", "ADMIN")

						// Demais endpoints de pessoas
						.pathMatchers("/api/pessoas/**").hasRole("ADMIN")

						// ========================================
						// ARQUIVOS
						// ========================================

						.pathMatchers("/api/arquivos/**").hasRole("ADMIN")

						// ========================================
						// UPLOAD
						// ========================================

						.pathMatchers(HttpMethod.POST, "/api/uploads").hasAnyRole("USER", "ADMIN")

						// ========================================
						// RESTANTE
						// ========================================

						.anyExchange().hasAnyRole("USER", "ADMIN"))

				.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt
						.jwtAuthenticationConverter(new ReactiveJwtAuthenticationConverterAdapter(jwtConverter))))

				.build();
	}
}