package com.tensai.projets.dtos;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;

import java.util.List;

public record ProjectResponseDTO(
        Long id,
        String name,
        String description,
        List<Long> workflowIds // Include the list of workflow IDs
) {
    public static ProjectResponseDTO fromEntity(Project project) {
        List<Long> workflowIds = project.getWorkflows().stream()
                .map(Workflow::getId)
                .toList();
        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                workflowIds
        );
    }
}