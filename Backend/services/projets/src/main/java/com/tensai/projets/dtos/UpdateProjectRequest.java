// UpdateProjectRequest.java
package com.tensai.projets.dtos;

import jakarta.validation.constraints.Size;

public record UpdateProjectRequest(
        @Size(max = 100, message = "Name must be less than 100 characters")
        String name,

        @Size(max = 500, message = "Description must be less than 500 characters")
        String description
) {}