package com.tensai.projets.dtos;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Builder
public record CreateProjectRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        String name,

        @Size(max = 500, message = "Description must be less than 500 characters")
        String description,

        String priority, // Optional, no default, no @NotBlank

        @NotNull(message = "Start date is required")
        @DateTimeFormat(pattern = "MM/dd/yyyy")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        @DateTimeFormat(pattern = "MM/dd/yyyy")
        LocalDate endDate,

        @Valid
        MultipartFile imageFile,

        List<Long> workflowIds,

        Long projectManagerId // Added (optional, if you prefer body over path variable)
) {}