package com.tensai.projets.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description, // Optional

        LocalDate dueDate, // Optional

        String priority, // Optional

        Double estimatedHours, // Optional

        Long assigneeId, // Optional

        @NotNull(message = "Workflow ID is required")
        Long workflowId
) {}