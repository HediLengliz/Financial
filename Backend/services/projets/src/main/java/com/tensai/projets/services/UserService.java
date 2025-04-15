package com.tensai.projets.services;

import com.tensai.projets.models.User;
import com.tensai.projets.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;

    public User syncUserFromJwt(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            throw new IllegalArgumentException("JWT missing email claim");
        }

        return userRepository.findByEmail(email)
                .map(existingUser -> {
                    existingUser.updateFromJwt(jwt);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .availability(true)
                            .build();
                    newUser.updateFromJwt(jwt);
                    return userRepository.save(newUser);
                });
    }

    public User register(String username, String email, String password,
                         String role, String name, String firstName, String lastName) {
        validateRole(role);
        validateEmailUniqueness(email);

        // Create in Keycloak first
        keycloakService.createUser(username, email, password, role, firstName, lastName);

        // Then create locally
        User user = User.builder()
                .email(email)
                .name(name)
                .firstName(firstName)
                .lastName(lastName)
                .role(role)
                .availability(true)
                .build();

        return userRepository.save(user);
    }

    private void validateRole(String role) {
        if (!Set.of("PROJECT_MANAGER", "PROJECT_OWNER").contains(role)) {
            throw new IllegalArgumentException("Invalid role. Allowed values: PROJECT_MANAGER, PROJECT_OWNER");
        }
    }

    private void validateEmailUniqueness(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
    }

    public Map<String, Object> login(String username, String password) {
        return keycloakService.authenticate(username, password);
    }
    public void logout(String refreshToken) {
        keycloakService.logout(refreshToken);
    }
}