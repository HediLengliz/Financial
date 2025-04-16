package com.tensai.projets.dtos;

import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public record UpdateProjectRequest(
        @Size(max = 100, message = "Name must be less than 100 characters")
        String name,

        @Size(max = 500, message = "Description must be less than 500 characters")
        String description,

        String status,  // Change from Status to String

        String priority,  // Change from Priority to String

        LocalDate startDate,
        LocalDate endDate,
        List<Long> workflowIds,
        MultipartFile imageFile,
        List<Long> workflows
) {}
