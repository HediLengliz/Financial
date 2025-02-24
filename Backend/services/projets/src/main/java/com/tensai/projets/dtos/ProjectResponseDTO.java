package com.tensai.projets.dtos;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;

import java.time.LocalDate;
import java.util.List;

public record ProjectResponseDTO(
        Long id,
        String name,
        String description,
        String status,   // Change Status type to String to send it as a string
        String priority, // Change Priority type to String to send it as a string
        LocalDate startDate,
        LocalDate endDate,
        String imageUrl
        //List<Long> workflowIds
) {
    public static ProjectResponseDTO fromEntity(Project project) {
        List<Long> workflowIds = project.getWorkflows().stream()
                .map(Workflow::getId)
                .toList();

        // Map Priority and Status enum to their string representations
        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus().toUpperCase(), // Convert Status enum to string
                project.getPriority().toUpperCase(), // Convert Priority enum to string
                project.getStartDate(),
                project.getEndDate(),
                buildImageUrl(project.getImagePath())
                //workflowIds
        );
    }

    private static String buildImageUrl(String imagePath) {
        return imagePath != null ? "http://localhost:8080/api/projects/images/" + imagePath : null;
    }
}
