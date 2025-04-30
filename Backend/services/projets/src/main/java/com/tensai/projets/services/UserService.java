package com.tensai.projets.services;

import com.tensai.projets.dtos.UpdateUserRequest;
import com.tensai.projets.dtos.UserDTO;
import com.tensai.projets.dtos.UserResponse;
import com.tensai.projets.dtos.UserWithProfileDTO;
import com.tensai.projets.models.User;
import com.tensai.projets.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService;
    private final FileStorageService fileStorageService;

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

        keycloakService.createUser(username, email, password, role, firstName, lastName);

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

    @Transactional
    public UserResponse updateUserProfile(Long userId, UpdateUserRequest request, User authenticatedUser) {
        if (!userId.equals(authenticatedUser.getId())) {
            throw new RuntimeException("You can only update your own profile");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        String profilePicturePath = user.getProfilePicture();
        System.out.println("Current profile picture: " + profilePicturePath);

        // Update profile picture if a new file is provided
        if (request.profilePicture() != null) {
            System.out.println("New profile picture provided");
            try {
                // Delete existing profile picture if it exists
                if (profilePicturePath != null) {
                    fileStorageService.deleteFile(profilePicturePath);
                    System.out.println("Deleted old profile picture: " + profilePicturePath);
                }
                profilePicturePath = fileStorageService.storeFileLocaly(request.profilePicture());
                System.out.println("Stored new profile picture with public_id: " + profilePicturePath);
            } catch (Exception e) {
                throw new RuntimeException("Failed to store profile picture: " + e.getMessage(), e);
            }
        } else {
            System.out.println("No new profile picture provided");
        }

        // Update other fields
        user.setName(request.name() != null && !request.name().trim().isEmpty() ? request.name() : user.getName());
        user.setFirstName(request.firstName() != null && !request.firstName().trim().isEmpty() ? request.firstName() : user.getFirstName());
        user.setLastName(request.lastName() != null && !request.lastName().trim().isEmpty() ? request.lastName() : user.getLastName());
        if (request.email() != null && !request.email().trim().isEmpty()) {
            if (!request.email().equals(user.getEmail()) && userRepository.findByEmail(request.email()).isPresent()) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.email());
        }
        user.setProfilePicture(profilePicturePath);
        System.out.println("User profile picture set to: " + profilePicturePath);

        User updatedUser = userRepository.save(user);
        System.out.println("Saved user with profile picture: " + updatedUser.getProfilePicture());

        // Update Keycloak email if changed
        if (request.email() != null && !request.email().trim().isEmpty() && !request.email().equals(authenticatedUser.getEmail())) {
            try {
                keycloakService.updateUserEmail(authenticatedUser.getEmail(), request.email());
                System.out.println("Updated email in Keycloak");
            } catch (Exception e) {
                throw new RuntimeException("Failed to update email in Keycloak: " + e.getMessage(), e);
            }
        }

        return UserResponse.fromEntity(updatedUser, fileStorageService);
    }

    @Transactional(readOnly = true)
    public List<UserWithProfileDTO> getAvailableUsers() {
        List<User> availableUsers = userRepository.findByAvailability(true);
        return availableUsers.stream()
                .map(user -> UserWithProfileDTO.fromEntity(user, fileStorageService))
                .collect(Collectors.toList());
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        keycloakService.initiatePasswordReset(user.getEmail());
    }

    public Map<String, Object> loginWithRememberMe(String username, String password) {
        return keycloakService.authenticateWithRememberMe(username, password);
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

    public FileStorageService getFileStorageService() {
        return fileStorageService;
    }
}