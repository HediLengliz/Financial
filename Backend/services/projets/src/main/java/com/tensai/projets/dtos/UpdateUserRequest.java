package com.tensai.projets.dtos;

import org.springframework.web.multipart.MultipartFile;

public record UpdateUserRequest(
        String name,
        String firstName,
        String lastName,
        String email,
        MultipartFile profilePicture
) {}