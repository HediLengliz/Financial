package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.dtos.ProjectResponseDTO;
import com.tensai.projets.dtos.UpdateProjectRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WorkflowRepository workflowRepository;
    private final FileStorageService fileStorageService;

    public ProjectService(
            ProjectRepository projectRepository,
            WorkflowRepository workflowRepository,
            FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.fileStorageService = fileStorageService;
    }

    public ProjectResponseDTO createProject(CreateProjectRequest request) {
        // Handle default values if status or priority are null
        String status = request.status() != null ? request.status() : "PENDING";  // Default to "PENDING" if null
        String priority = request.priority() != null ? request.priority() : "LOW";  // Default to "LOW" if null

        String imagePath = request.imageFile() != null ? fileStorageService.storeFile(request.imageFile()) : null;

        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(status);
        project.setPriority(priority);
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setImagePath(imagePath);

        return ProjectResponseDTO.fromEntity(projectRepository.save(project));
    }

    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long id) {
        return ProjectResponseDTO.fromEntity(getProjectEntity(id));
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request) {
        Project existingProject = getProjectEntity(id);

        String imagePath = existingProject.getImagePath();
        if (request.imageUrl() != null && !request.imageUrl().isEmpty()) {
            imagePath = fileStorageService.storeFile(request.imageUrl());
        }

        String status = request.status() != null ? request.status() : "PENDING";  // Default to "PENDING" if null
        String priority = request.priority() != null ? request.priority() : "LOW";  // Default to "LOW" if null

        existingProject.setName(request.name() != null ? request.name() : existingProject.getName());
        existingProject.setDescription(request.description() != null ? request.description() : existingProject.getDescription());
        existingProject.setStatus(status);
        existingProject.setPriority(priority);
        existingProject.setStartDate(request.startDate() != null ? request.startDate() : existingProject.getStartDate());
        existingProject.setEndDate(request.endDate() != null ? request.endDate() : existingProject.getEndDate());
        existingProject.setImagePath(imagePath);
        existingProject.setWorkflows(existingProject.getWorkflows());

        return ProjectResponseDTO.fromEntity(projectRepository.save(existingProject));
    }

    @Transactional(readOnly = true)
    public Project getProjectEntity(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));
    }

    public void deleteProject(Long id) {
        Project project = getProjectEntity(id);

        if (project.getImagePath() != null) {
            fileStorageService.deleteFile(project.getImagePath());
        }

        projectRepository.deleteById(id);
    }
}
