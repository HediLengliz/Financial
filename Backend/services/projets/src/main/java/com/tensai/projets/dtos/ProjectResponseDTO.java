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
        String imageUrl,       // Changed from imagePath
        List<Long> workflowIds
) {
    public static ProjectResponseDTO fromEntity(Project project) {
        List<Long> workflowIds = project.getWorkflows().stream()
                .map(Workflow::getId)
                .toList();

        String imageUrl = buildImageUrl(project.getImagePath());

        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(),
                project.getPriority(),
                project.getStartDate(),
                project.getEndDate(),
                imageUrl,       // Now in correct position (8th parameter)
                workflowIds     // 9th parameter
        );
    }

    private static String buildImageUrl(String imagePath) {
        if (imagePath == null || imagePath.isEmpty()) {
            return null;
        }
        return "http://localhost:8070/api/projects/images/" + imagePath;
    }
}