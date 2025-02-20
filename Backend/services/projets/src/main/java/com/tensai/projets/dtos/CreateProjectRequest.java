package com.tensai.projets.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public record CreateProjectRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        String name,

        @Size(max = 500, message = "Description must be less than 500 characters")
        String description,

        @NotBlank(message = "Status is required")
        String status,  // e.g., "pending", "active", "completed"

        @NotBlank(message = "Priority is required")
        String priority,  // e.g., "low", "medium", "high"

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @NotNull MultipartFile imageFile,
        List<Long> workflowIds


        //List<Long> memberIds  // IDs of members associated with the project
) {}