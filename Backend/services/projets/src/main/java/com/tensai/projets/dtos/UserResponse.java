package com.tensai.projets.dtos;

import com.tensai.projets.models.User;
import com.tensai.projets.services.FileStorageService;

public record UserResponse(
        Long id,
        String username,
        String firstName,
        String lastName,
        String email,
        String role,
        boolean availability,
        String profilePictureUrl
) {
    public static UserResponse fromEntity(User user, FileStorageService fileStorageService) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getAvailability(),
                user.getProfilePicture() != null ? fileStorageService.getFileUrl(user.getProfilePicture()) : null
        );
    }
}