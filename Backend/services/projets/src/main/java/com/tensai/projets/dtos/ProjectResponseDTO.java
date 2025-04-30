package com.tensai.projets.dtos;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;

import java.time.LocalDate;
import java.util.List;

public record ProjectResponseDTO(
        Long id,
        String name,
        String description,
        String status,
        String priority,
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl,
        List<WorkflowResponse> workflows
) {
    public static ProjectResponseDTO fromEntity(Project project) {
        List<WorkflowResponse> workflows = project.getWorkflows().stream()
                .map(WorkflowResponse::fromEntity)
                .toList();

        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus().toString(),
                project.getPriority().toString(),
                project.getStartDate(),
                project.getEndDate(),
                buildImageUrl(project.getImagePath()),
                workflows
        );
    }

    private static String buildImageUrl(String imagePath) {
        return imagePath != null
                ? "http://localhost:8080/api/projects/images/" + imagePath
                : null;
    }
}