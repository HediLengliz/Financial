package com.tensai.projets.dtos;

import com.tensai.projets.models.Task;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record CreateTaskRequest(
        @NotBlank String title,
        String description,
        @FutureOrPresent LocalDate dueDate,
        Task.TaskPriority priority,
        Double estimatedHours,
        @Positive Long assigneeId,
        @NotNull Integer orderInWorkflow,
        @NotNull Long workflowId
) {}