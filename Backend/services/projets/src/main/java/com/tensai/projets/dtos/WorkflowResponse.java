package com.tensai.projets.dtos;

import com.tensai.projets.models.Workflow;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

public record WorkflowResponse(
        Long id,
        String name,
        String description,
        String status,
        LocalDate createdAt,
        Long projectId,
        boolean hasTasks,
        double progress,
        List<TaskResponse> tasks, // This can now be null
        String userName // Added only userName
) {
    public static WorkflowResponse fromEntity(Workflow workflow) {
        // Handle null tasks by initializing to an empty list
        List<TaskResponse> tasks = workflow.getTasks() != null
                ? workflow.getTasks().stream()
                .map(TaskResponse::fromEntity)
                .toList()
                : Collections.emptyList();

        // Get user name if assigned
        String userName = workflow.getUser() != null ? workflow.getUser().getName() : null;

        return new WorkflowResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getDescription(),
                workflow.getStatus(),
                workflow.getCreatedAt(),
                workflow.getProject() != null ? workflow.getProject().getId() : null,
                !tasks.isEmpty(),
                workflow.getProgress(),
                tasks,
                userName
        );
    }
}