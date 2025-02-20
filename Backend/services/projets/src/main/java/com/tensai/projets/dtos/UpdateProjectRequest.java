package com.tensai.projets.dtos;

import com.tensai.projets.models.Workflow;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public record UpdateProjectRequest(
        @Size(max = 100, message = "Name must be less than 100 characters")
        String name,

        @Size(max = 500, message = "Description must be less than 500 characters")
        String description,

        String status,
        String priority,
        LocalDate startDate,
        LocalDate endDate,
        List<Long> workflowIds,
        @NotNull MultipartFile imageFile,
        List<Long> workflows
) {}