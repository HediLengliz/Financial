package com.tensai.projets.controllers;

import com.tensai.projets.dtos.LoginRequest;
import com.tensai.projets.dtos.RegisterRequest;
import com.tensai.projets.models.User;
import com.tensai.projets.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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

    // Get authenticated user's details
    @GetMapping("/me")
    public ResponseEntity<User> getUserDetails(@AuthenticationPrincipal Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt);
        return ResponseEntity.ok(user);
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        User user = userService.register(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRole(),
                request.getName(),
                request.getFirstName(), // Updated from getFirstname
                request.getLastName()   // Updated from getLastname
        );
        return ResponseEntity.ok(user);
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Validated @RequestBody LoginRequest request) {
        Map<String, Object> tokenResponse = userService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(tokenResponse);
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
}


