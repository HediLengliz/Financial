package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.dtos.ProjectResponseDTO;
import com.tensai.projets.dtos.UpdateProjectRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Task;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.TaskRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WorkflowRepository workflowRepository;
    private final TaskRepository taskRepository;
    private final FileStorageService fileStorageService;

    public ProjectService(
            ProjectRepository projectRepository,
            WorkflowRepository workflowRepository,
            TaskRepository taskRepository,
            FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.taskRepository = taskRepository;
        this.fileStorageService = fileStorageService;
    }

    public ProjectResponseDTO createProject(CreateProjectRequest request) {
        String status = request.status() != null ? request.status() : "PENDING";
        String priority = request.priority() != null ? request.priority() : "LOW";
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
        // For single project, use separate fetches
        Project project = projectRepository.findByIdWithWorkflows(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));

        // Initialize tasks for workflows
        List<Workflow> workflows = workflowRepository.findWithTasksByProjectId(id);
        project.setWorkflows(workflows);

        return ProjectResponseDTO.fromEntity(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        // Step 1: Get projects with workflows
        List<Project> projects = projectRepository.findAllWithWorkflows();

        // Step 2: Get all workflow IDs
        List<Long> workflowIds = projects.stream()
                .flatMap(p -> p.getWorkflows().stream())
                .map(Workflow::getId)
                .toList();

        // Step 3: Get all tasks for these workflows
        Map<Long, List<Task>> tasksByWorkflowId = taskRepository.findByWorkflowIds(workflowIds).stream()
                .collect(Collectors.groupingBy(task -> task.getWorkflow().getId()));

        // Step 4: Assign tasks to workflows
        projects.forEach(project ->
                project.getWorkflows().forEach(workflow ->
                        workflow.setTasks(tasksByWorkflowId.getOrDefault(workflow.getId(), List.of()))
                )
        );

        return projects.stream()
                .map(ProjectResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request) {
        Project existingProject = getProjectEntity(id);
        String imagePath = existingProject.getImagePath();

        if (request.imageUrl() != null && !request.imageUrl().isEmpty()) {
            imagePath = fileStorageService.storeFile(request.imageUrl());
        }

        String status = request.status() != null ? request.status() : "PENDING";
        String priority = request.priority() != null ? request.priority() : "LOW";

        existingProject.setName(request.name() != null ? request.name() : existingProject.getName());
        existingProject.setDescription(request.description() != null ? request.description() : existingProject.getDescription());
        existingProject.setStatus(status);
        existingProject.setPriority(priority);
        existingProject.setStartDate(request.startDate() != null ? request.startDate() : existingProject.getStartDate());
        existingProject.setEndDate(request.endDate() != null ? request.endDate() : existingProject.getEndDate());
        existingProject.setImagePath(imagePath);

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