package com.tensai.projets.dtos;

import com.tensai.projets.models.User;
import com.tensai.projets.services.FileStorageService;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String profilePictureUrl;

    public UserResponse() {}

    public UserResponse(Long id, String username, String email, String firstName, String lastName, String role, String profilePictureUrl) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.profilePictureUrl = profilePictureUrl;
    }

    public static UserResponse fromEntity(User user, FileStorageService fileStorageService) {
        String profilePictureUrl = user.getProfilePicture() != null
                ? fileStorageService.getFileUrl(user.getProfilePicture())
                : null;
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                profilePictureUrl
        );
    }
}