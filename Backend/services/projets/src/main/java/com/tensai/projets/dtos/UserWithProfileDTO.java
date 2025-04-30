package com.tensai.projets.dtos;

import com.tensai.projets.models.User;
import com.tensai.projets.services.FileStorageService;

public record UserWithProfileDTO(
        Long id,
        String name,
        boolean availability,
        String role,
        String email,
        String profilePictureUrl
) {
    public static UserWithProfileDTO fromEntity(User user, FileStorageService fileStorageService) {
        String profilePictureUrl = user.getProfilePicture() != null
                ? fileStorageService.getFileUrl(user.getProfilePicture())
                : null;
        return new UserWithProfileDTO(
                user.getId(),
                user.getName(),
                user.getAvailability(),
                user.getRole(),
                user.getEmail(),
                profilePictureUrl
        );
    }
}