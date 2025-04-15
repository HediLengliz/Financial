package com.tensai.apigateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.List;

@SpringBootApplication
@Configuration
@EnableDiscoveryClient
public class ApiGatewayApplication {

	private static final Logger logger = LoggerFactory.getLogger(ApiGatewayApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				// Handle OPTIONS requests for all paths
				.route("options_route", r -> r
						.method(HttpMethod.OPTIONS)
						.filters(f -> f.filter((exchange, chain) -> {
							logger.info("Handling OPTIONS request for path: {}", exchange.getRequest().getPath());
							// Directly set the status and headers on the response
							exchange.getResponse().setStatusCode(HttpStatus.OK);
							exchange.getResponse().getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:4200");
							exchange.getResponse().getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET,POST,PUT,DELETE,OPTIONS");
							exchange.getResponse().getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "Authorization,Content-Type,Accept");
							exchange.getResponse().getHeaders().add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
							exchange.getResponse().getHeaders().add(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
							return Mono.empty();
						}))
						.uri("no://op")
				)
				// Route for /api/users/**
				.route("projects-service-users", r -> r
						.path("/api/users/**")
						.and()
						.method(HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE)
						.filters(f -> f
								.stripPrefix(1)
								.filter((exchange, chain) -> {
									String path = exchange.getRequest().getPath().toString();
									if (path.endsWith("/register") || path.endsWith("/login")) {
										exchange.getRequest().mutate().header(HttpHeaders.AUTHORIZATION, (String) null);
										logger.debug("Removed Authorization header for {}", path);
									}
									return chain.filter(exchange);
								}))
						.uri("lb://projects-service")
				)
				.route("projects-service", r -> r
						.path("/api/projects/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://projects-service")
				)
				.route("projects-service-images", r -> r
						.path("/api/projects/images/**")
						.filters(f -> f.stripPrefix(2))
						.uri("lb://projects-service")
				)
				.route("projects-service-workflows", x -> x
						.path("/api/workflows/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://projects-service")
				)
				.route("projects-service-tasks", y -> y
						.path("/api/tasks/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://projects-service")
				)
				.route("projects-service-reports", y -> y
						.path("/api/reports/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://projects-service")
				)
				.route("projects-service-alerts", z -> z
						.path("/api/alerts/**")
						.filters(f -> f.stripPrefix(1))
						.uri("lb://projects-service")
				)
				.build();
	}

	@Bean
	public CorsWebFilter corsWebFilter() {
		CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.setAllowCredentials(true);
		corsConfig.setAllowedOrigins(List.of("http://localhost:4200"));
		corsConfig.setAllowedHeaders(List.of(
				HttpHeaders.ORIGIN,
				HttpHeaders.CONTENT_TYPE,
				HttpHeaders.ACCEPT,
				HttpHeaders.AUTHORIZATION
		));
		corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		corsConfig.setExposedHeaders(List.of(HttpHeaders.AUTHORIZATION));
		corsConfig.setMaxAge(3600L);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);

		logger.info("CORS configuration applied for origin: http://localhost:4200");

		return new CorsWebFilter(source);
	}
}