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

        @NotBlank(message = "Status is required")
        String status,  // Change from Status to String

        @NotBlank(message = "Priority is required")
        String priority,  // Change from Priority to String

        @NotNull(message = "Start date is required")
        @DateTimeFormat(pattern = "MM/dd/yyyy")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        @DateTimeFormat(pattern = "MM/dd/yyyy")
        LocalDate endDate,

        @NotNull
        @Valid
        MultipartFile imageFile,
        List<Long> workflowIds
) {}
