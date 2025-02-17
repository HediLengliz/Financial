package com.tensai.projets.dtos;

import com.tensai.projets.models.Task;

import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        Long workflowId, // Include the workflow ID
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskResponse fromEntity(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getWorkflow() != null ? task.getWorkflow().getId() : null,
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}