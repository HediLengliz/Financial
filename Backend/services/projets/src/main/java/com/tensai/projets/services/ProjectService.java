package com.tensai.projets.services;

import com.tensai.projets.dtos.*;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Task;
import com.tensai.projets.models.User;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.TaskRepository;
import com.tensai.projets.repositories.UserRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final WorkflowRepository workflowRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;
    private final RestTemplate restTemplate;

    @Value("${predictor.service.url:http://predictor_service:8001}")
    private String predictorServiceUrl;

    public ProjectService(
            ProjectRepository projectRepository,
            WorkflowRepository workflowRepository,
            TaskRepository taskRepository,
            UserRepository userRepository,
            FileStorageService fileStorageService,
            KafkaTemplate<String, AlertEvent> kafkaTemplate,
            RestTemplate restTemplate) {
        this.projectRepository = projectRepository;
        this.workflowRepository = workflowRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.kafkaTemplate = kafkaTemplate;
        this.restTemplate = restTemplate;
    }

    // Updated createProject to include project owner
    public ProjectResponseDTO createProject(CreateProjectRequest request, Long projectManagerId, User projectOwner) {
        // Validate that the authenticated user is a PROJECT_OWNER
        if (!"PROJECT_OWNER".equals(projectOwner.getRole())) {
            throw new RuntimeException("Only PROJECT_OWNER can create projects");
        }

        // Find the project manager and validate
        User projectManager = userRepository.findById(projectManagerId)
                .orElseThrow(() -> new RuntimeException("Project manager not found"));

        // Ensure the user is a project manager and available
        if (!"PROJECT_MANAGER".equals(projectManager.getRole())) {
            throw new RuntimeException("Selected user is not a project manager");
        }
        if (!projectManager.getAvailability()) {
            throw new RuntimeException("Selected project manager is not available");
        }

        // Create the project
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus("NOT_STARTED");
        project.setPriority(request.priority());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setImagePath(request.imageFile() != null ? fileStorageService.storeFile(request.imageFile()) : null);
        project.setProgress(0.0);
        project.setProjectManager(projectManager);
        project.setProjectOwner(projectOwner); // Set the project owner

        // Update the project manager's availability
        projectManager.setAvailability(false);
        userRepository.save(projectManager);

        // Save the project
        Project savedProject = projectRepository.save(project);
        handleProjectAlerts(savedProject);
        return ProjectResponseDTO.fromEntity(savedProject);
    }

    // Updated getProjects to filter by project owner
    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getProjects(String keyword, String status, String priority, User projectOwner) {
        // Validate that the user is a PROJECT_OWNER
        if (!"PROJECT_OWNER".equals(projectOwner.getRole())) {
            throw new RuntimeException("Only PROJECT_OWNER can view their projects");
        }

        List<Project> projects = projectRepository.findByProjectOwner(projectOwner);

        if (keyword != null && !keyword.trim().isEmpty()) {
            projects = projects.stream()
                    .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase()))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.isEmpty()) {
            projects = projects.stream()
                    .filter(p -> p.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        if (priority != null && !priority.isEmpty()) {
            projects = projects.stream()
                    .filter(p -> p.getPriority() != null && p.getPriority().equalsIgnoreCase(priority))
                    .collect(Collectors.toList());
        }

        List<Long> workflowIds = projects.stream()
                .flatMap(p -> p.getWorkflows().stream())
                .map(Workflow::getId)
                .toList();
        Map<Long, List<Task>> tasksByWorkflowId = taskRepository.findByWorkflowIds(workflowIds).stream()
                .collect(Collectors.groupingBy(task -> task.getWorkflow().getId()));
        projects.forEach(project ->
                project.getWorkflows().forEach(workflow ->
                        workflow.setTasks(tasksByWorkflowId.getOrDefault(workflow.getId(), List.of()))
                )
        );

        return projects.stream()
                .map(ProjectResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // Existing methods remain largely unchanged, but ensure getProjectById checks ownership
    @Transactional
    public ProjectResponseDTO getProjectById(Long id, User projectOwner) {
        Project project = projectRepository.findByIdWithWorkflows(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));

        // Verify that the project belongs to the authenticated project owner
        if (!"PROJECT_OWNER".equals(projectOwner.getRole()) || !project.getProjectOwner().getId().equals(projectOwner.getId())) {
            throw new RuntimeException("You do not have permission to view this project");
        }

        List<Workflow> workflows = workflowRepository.findWithTasksByProjectId(id);
        project.getWorkflows().clear();
        project.getWorkflows().addAll(workflows);

        for (Workflow workflow : project.getWorkflows()) {
            double workflowProgress = calculateWorkflowProgress(workflow);
            workflow.setProgress(workflowProgress);
            updateWorkflowStatus(workflow, workflowProgress);
            workflowRepository.save(workflow);
        }

        double projectProgress = calculateProjectProgress(project);
        project.setProgress(projectProgress);
        updateProjectStatus(project, projectProgress);
        projectRepository.save(project);

        return ProjectResponseDTO.fromEntity(project);
    }

    // Update deleteProject to check ownership
    public void deleteProject(Long id, User projectOwner) {
        Project project = getProjectEntity(id);
        if (!"PROJECT_OWNER".equals(projectOwner.getRole()) || !project.getProjectOwner().getId().equals(projectOwner.getId())) {
            throw new RuntimeException("You do not have permission to delete this project");
        }
        if (project.getImagePath() != null) {
            fileStorageService.deleteFile(project.getImagePath());
        }
        projectRepository.deleteById(id);
    }

    // Update updateProject to check ownership
    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request, User projectOwner) {
        Project existingProject = getProjectEntity(id);
        if (!"PROJECT_OWNER".equals(projectOwner.getRole()) || !existingProject.getProjectOwner().getId().equals(projectOwner.getId())) {
            throw new RuntimeException("You do not have permission to update this project");
        }
        String imagePath = existingProject.getImagePath();

        if (request.imageUrl() != null && !request.imageUrl().isEmpty()) {
            imagePath = fileStorageService.storeFile(request.imageUrl());
        }

        existingProject.setName(request.name() != null ? request.name() : existingProject.getName());
        existingProject.setDescription(request.description() != null ? request.description() : existingProject.getDescription());
        if (request.status() != null) existingProject.setStatus(request.status());
        existingProject.setPriority(request.priority());
        existingProject.setStartDate(request.startDate() != null ? request.startDate() : existingProject.getStartDate());
        existingProject.setEndDate(request.endDate() != null ? request.endDate() : existingProject.getEndDate());
        existingProject.setImagePath(imagePath);

        Project updatedProject = projectRepository.save(existingProject);
        handleProjectAlerts(updatedProject);
        return ProjectResponseDTO.fromEntity(updatedProject);
    }

    // Existing methods (unchanged unless specified)
    private void handleProjectAlerts(Project project) {
        if ("HIGH".equalsIgnoreCase(project.getPriority())) {
            sendAlert("PROJECT", "HIGH_PRIORITY", project.getName(), null);
        }
        if ("COMPLETED".equalsIgnoreCase(project.getStatus())) {
            sendAlert("PROJECT", "COMPLETED", project.getName(), null);
        }
        if (project.getEndDate() != null && isWithinDays(project.getEndDate(), 5)) {
            sendAlert("PROJECT", "DEADLINE_SOON", project.getName(), project.getEndDate());
        }
    }

    private boolean isWithinDays(LocalDate date, int days) {
        return ChronoUnit.DAYS.between(LocalDate.now(), date) <= days;
    }

    private void sendAlert(String entityType, String alertType, String name, LocalDate date) {
        kafkaTemplate.send("project-alerts", new AlertEvent(
                entityType,
                alertType,
                name,
                date
        ));
    }

    @Transactional(readOnly = true)
    public Project getProjectEntity(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));
    }

    public double calculateProjectProgress(Project project) {
        List<Workflow> workflows = project.getWorkflows();
        if (workflows == null || workflows.isEmpty()) return 0.0;
        return workflows.stream()
                .mapToDouble(Workflow::getProgress)
                .average()
                .orElse(0.0);
    }

    private double calculateWorkflowProgress(Workflow workflow) {
        List<Task> tasks = workflow.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0.0;
        long completedTasks = tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
                .count();
        return (completedTasks * 100.0) / tasks.size();
    }

    public void updateProjectStatus(Project project, double progress) {
        if (progress == 100.0) {
            project.setStatus("COMPLETED");
        } else if (progress > 0.0) {
            project.setStatus("IN_PROGRESS");
        } else {
            project.setStatus("NOT_STARTED");
        }
    }

    private void updateWorkflowStatus(Workflow workflow, double progress) {
        if (progress == 100.0) {
            workflow.setStatus("COMPLETED");
        } else if (progress > 0.0) {
            workflow.setStatus("IN_PROGRESS");
        } else {
            workflow.setStatus("NOT_STARTED");
        }
    }

    public UserDTO getProjectManagerByProjectId(Long projectId) {
        Project project = projectRepository.findByIdWithManager(projectId)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(projectId));
        User manager = project.getProjectManager();
        return new UserDTO(manager.getId(), manager.getName(), manager.getAvailability(), manager.getRole(), manager.getEmail());
    }

    public PredictionResultDTO predictProjectDetails(Long projectId) {
        Project project = getProjectEntity(projectId);
        String description = project.getDescription();
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Project description cannot be empty for prediction");
        }
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("description", description);
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<PredictionResultDTO> response = restTemplate.exchange(
                predictorServiceUrl + "/predict",
                HttpMethod.POST,
                entity,
                PredictionResultDTO.class
        );
        return response.getBody();
    }

    // Keep getAvailableProjectManagers unchanged
    @Transactional(readOnly = true)
    public List<UserDTO> getAvailableProjectManagers() {
        List<User> availableManagers = userRepository.findByRoleAndAvailability("PROJECT_MANAGER", true);
        return availableManagers.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getAvailability(), user.getRole(), user.getEmail()))
                .collect(Collectors.toList());
    }
}