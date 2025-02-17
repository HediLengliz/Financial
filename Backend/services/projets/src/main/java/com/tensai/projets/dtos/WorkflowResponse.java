package com.tensai.projets.dtos;

import com.tensai.projets.models.Workflow;

public record WorkflowResponse(
        Long id,
        String name,
        String description,
        Long projectId // Include the project ID
) {
    public static WorkflowResponse fromEntity(Workflow workflow) {
        return new WorkflowResponse(
                workflow.getId(),
                workflow.getName(),
                workflow.getDescription(),
                workflow.getProject() != null ? workflow.getProject().getId() : null
        );
    }
}