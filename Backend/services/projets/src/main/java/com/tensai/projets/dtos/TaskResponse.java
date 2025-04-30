package com.tensai.projets.dtos;

import com.tensai.projets.models.Task;

import java.time.LocalDate;

public record TaskResponse(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        LocalDate dueDate,
        Long WorkflowId,
        int orderInWorkflow
) {
    public static TaskResponse fromEntity(Task task) {
        return new TaskResponse(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getStatus(),
                        task.getPriority(),
                        task.getDueDate(),
                        task.getWorkflow().getId(),
                        task.getOrderInWorkflow()
                );
    }
}