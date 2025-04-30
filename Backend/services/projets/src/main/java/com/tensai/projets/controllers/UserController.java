package com.tensai.projets.controllers;

import com.tensai.projets.dtos.LoginRequest;
import com.tensai.projets.dtos.RegisterRequest;
import com.tensai.projets.dtos.UpdateUserRequest;
import com.tensai.projets.dtos.UserResponse;
import com.tensai.projets.dtos.UserWithProfileDTO;
import com.tensai.projets.models.User;
import com.tensai.projets.services.FileStorageService;
import com.tensai.projets.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
            summary = "Get current user details",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserDetails(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt);
        return ResponseEntity.ok(UserResponse.fromEntity(user, userService.getFileStorageService()));
    }

    @Operation(
            summary = "Update current user profile",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateUserProfile(
            @RequestPart(value = "name", required = false) String name,
            @RequestPart(value = "firstName", required = false) String firstName,
            @RequestPart(value = "lastName", required = false) String lastName,
            @RequestPart(value = "email", required = false) String email,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @AuthenticationPrincipal Jwt jwt) {
        System.out.println("Received update request: name=" + name + ", email=" + email +
                ", firstName=" + firstName + ", lastName=" + lastName +
                ", profilePicture=" + (profilePicture != null ? profilePicture.getOriginalFilename() : "null"));

        UpdateUserRequest request = new UpdateUserRequest(name, firstName, lastName, email, profilePicture);
        User user = userService.syncUserFromJwt(jwt);
        UserResponse updatedUser = userService.updateUserProfile(user.getId(), request, user);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(
            summary = "Get all available users",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @GetMapping("/available")
    public ResponseEntity<List<UserWithProfileDTO>> getAvailableUsers() {
        List<UserWithProfileDTO> availableUsers = userService.getAvailableUsers();
        return ResponseEntity.ok(availableUsers);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest request) {
        User user = userService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRole(),
                request.getName(),
                request.getFirstName(),
                request.getLastName()
        );
        return ResponseEntity.ok(UserResponse.fromEntity(user, userService.getFileStorageService()));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Validated @RequestBody LoginRequest request) {
        Map<String, Object> tokenResponse = userService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/login/remember-me")
    public ResponseEntity<Map<String, Object>> loginWithRememberMe(@Validated @RequestBody LoginRequest request) {
        Map<String, Object> tokenResponse = userService.loginWithRememberMe(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        userService.forgotPassword(email);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(
            summary = "Logout current user",
            security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody Map<String, String> request, @AuthenticationPrincipal Jwt jwt) {
        String refreshToken = request.get("refresh_token");
        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new IllegalArgumentException("Refresh token is required");
        }
        userService.logout(refreshToken);
        return ResponseEntity.ok().build();
    }

    public FileStorageService getFileStorageService() {
        return userService.getFileStorageService();
    }
}