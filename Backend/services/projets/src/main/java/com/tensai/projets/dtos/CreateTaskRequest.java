package com.tensai.projets.dtos;

import com.tensai.projets.models.Task;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank String title, // Required field
        String description, // Optional field
        LocalDate dueDate, // Must be today or in the future
        @NotNull String status, // Required field
        String priority, // Optional field (can be null)
        Double estimatedHours, // Optional field (can be null)
        Long assigneeId, // Optional field (can be null)
        @NotNull Integer orderInWorkflow, // Optional field (can be null)
        @NotNull Long workflowId // Required field (passed from the route)
) {}