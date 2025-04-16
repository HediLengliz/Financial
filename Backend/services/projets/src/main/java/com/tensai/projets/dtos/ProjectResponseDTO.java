package com.tensai.projets.dtos;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.services.FileStorageService;

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
        UserDTO projectManager
) {
    public static ProjectResponseDTO fromEntity(Project project, FileStorageService fileStorageService) {
        List<WorkflowResponse> workflows = project.getWorkflows().stream()
                .map(WorkflowResponse::fromEntity)
                .toList();

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
                project.getStatus(),
                project.getPriority(),
                project.getStartDate(),
                project.getEndDate(),
                buildImageUrl(project.getImagePath(), fileStorageService),
                project.getProgress(),
                workflows,
                managerDTO
        );
    }

    private static String buildImageUrl(String imagePath, FileStorageService fileStorageService) {
        return imagePath != null ? fileStorageService.getFileUrl(imagePath) : null;
    }
}