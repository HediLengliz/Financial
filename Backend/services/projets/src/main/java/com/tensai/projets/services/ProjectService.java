package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.dtos.ProjectResponseDTO;
import com.tensai.projets.dtos.UpdateProjectRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import com.tensai.projets.services.FileStorageService;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WorkflowRepository workflowRepository;
    private final FileStorageService fileStorageService; // Add this

    public ProjectService(
            ProjectRepository projectRepository,
            WorkflowRepository workflowRepository,
            FileStorageService fileStorageService) { // Add this parameter
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.fileStorageService = fileStorageService; // Initialize it
    }

    public ProjectResponseDTO createProject(CreateProjectRequest request) {
        if (request.endDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        // Fetch workflows by their IDs
        List<Workflow> workflows = workflowRepository.findAllById(request.workflowIds());

        // Store the file and get its path
        String fileName = fileStorageService.storeFile(request.imageFile());

        // Create the project
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setPriority(request.priority());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setImagePath(fileName);
        project.setWorkflows(workflows); // Associate workflows

        // Save the project
        Project savedProject = projectRepository.save(project);

        return ProjectResponseDTO.fromEntity(savedProject);
    }
    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = getProjectEntity(id);
        return ProjectResponseDTO.fromEntity(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request) {
        Project project = getProjectEntity(id);

        if (request.name() != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        if (request.status() != null) project.setStatus(request.status());
        if (request.priority() != null) project.setPriority(request.priority());
        if (request.startDate() != null) project.setStartDate(request.startDate());
        if (request.endDate() != null) project.setEndDate(request.endDate());

        // Handle file update
        if (request.imageFile() != null && !request.imageFile().isEmpty()) {
            String fileName = fileStorageService.storeFile(request.imageFile());
            project.setImagePath(fileName);
        }

        return ProjectResponseDTO.fromEntity(projectRepository.save(project));
    }
    @Transactional(readOnly = true)
    public Project getProjectEntity(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));
    }
    public void deleteProject(Long id) {
        Project project = getProjectEntity(id);

        // Delete associated file
        if (project.getImagePath() != null) {
            fileStorageService.deleteFile(project.getImagePath());
        }

        projectRepository.deleteById(id);
    }
}