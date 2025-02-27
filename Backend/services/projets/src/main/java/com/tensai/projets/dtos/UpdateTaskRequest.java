package com.tensai.projets.dtos;

import com.tensai.projets.models.Task;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String description,
        LocalDate dueDate,
        String priority,
        Double estimatedHours,
        Long assigneeId,
        Integer orderInWorkflow, // Updated: Added orderInWorkflow field
        Long workflowId ,
        String status// Updated: Added workflowId field
) {}