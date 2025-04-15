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
        double progress,
        List<WorkflowResponse> workflows,
        UserDTO projectManager // Added
) {
    public static ProjectResponseDTO fromEntity(Project project) {
        List<WorkflowResponse> workflows = project.getWorkflows().stream()
                .map(WorkflowResponse::fromEntity)
                .toList();

        // Create UserDTO for the project manager if present
        UserDTO managerDTO = project.getProjectManager() != null ?
                new UserDTO(
                        project.getProjectManager().getId(),
                        project.getProjectManager().getName(),
                        project.getProjectManager().getAvailability(),
                        project.getProjectManager().getRole(),
                        project.getProjectManager().getEmail()
                ) : null;

        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStatus(), // Assuming status is a String now
                project.getPriority(), // Assuming priority is a String now
                project.getStartDate(),
                project.getEndDate(),
                buildImageUrl(project.getImagePath()),
                project.getProgress(),
                workflows,
                managerDTO
        );
    }

    private static String buildImageUrl(String imagePath) {
        return imagePath != null
                ? "http://localhost:8081/api/projects/images/" + imagePath // Updated path to match @RequestMapping
                : null;
    }

}