package com.tensai.projets.dtos;

import com.tensai.projets.models.Workflow;

import java.time.LocalDate;
import java.util.List;
import java.util.Collections; // Import Collections for empty list

public record WorkflowResponse(
        Long id,
        String name,
        String description,
        String status,
        LocalDate createdAt,
        Long projectId,
        boolean hasTasks,
        List<TaskResponse> tasks // This can now be null
) {
    public static WorkflowResponse fromEntity(Workflow workflow) {
        // Handle null tasks by initializing to an empty list
        List<TaskResponse> tasks = workflow.getTasks() != null
                ? workflow.getTasks().stream()
                .map(TaskResponse::fromEntity)
                .toList()
                : Collections.emptyList(); // Use empty list if tasks is null

        return new WorkflowResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getDescription(),
                workflow.getStatus(),
                workflow.getCreatedAt(),
                workflow.getProject() != null ? workflow.getProject().getId() : null,
                !tasks.isEmpty(), // Calculate hasTasks
                tasks
        );
    }
}