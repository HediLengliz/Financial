package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateWorkflowRequest;
import com.tensai.projets.dtos.UserDTO;
import com.tensai.projets.dtos.WorkflowResponse;
import com.tensai.projets.dtos.WorkflowUpdateRequest;
import com.tensai.projets.dtos.AlertEvent;
import com.tensai.projets.email.EmailService;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Task;
import com.tensai.projets.models.User;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.UserRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import jakarta.mail.MessagingException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkflowService {
    private final WorkflowRepository workflowRepository;
    private final ProjectService projectService;
    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public WorkflowService(WorkflowRepository workflowRepository,
                           ProjectService projectService,
                           KafkaTemplate<String, AlertEvent> kafkaTemplate,
                           ProjectRepository projectRepository,
                           UserRepository userRepository,
                           EmailService emailService) {
        this.workflowRepository = workflowRepository;
        this.projectService = projectService;
        this.kafkaTemplate = kafkaTemplate;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    public WorkflowResponse createWorkflow(CreateWorkflowRequest request, Long userId) {
        Project project = projectService.getProjectEntity(request.projectId());
        if (project == null) {
            throw new GlobalExceptionHandler.ProjectNotFoundException(request.projectId());
        }

        User assignedUser = null;
        if (userId != null) {
            assignedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!assignedUser.getAvailability()) {
                throw new RuntimeException("Selected user is not available");
            }
        }

        Workflow workflow = new Workflow();
        workflow.setName(request.name());
        workflow.setDescription(request.description());
        workflow.setStatus("NOT_STARTED");
        workflow.setCreatedAt(LocalDate.now());
        workflow.setProject(project);
        workflow.setProgress(0.0);
        workflow.setUser(assignedUser);

        if (assignedUser != null) {
            assignedUser.setAvailability(false);
            userRepository.save(assignedUser);
        }

        project.getWorkflows().add(workflow);
        Workflow savedWorkflow = workflowRepository.save(workflow);
        handleWorkflowAlerts(savedWorkflow);

        updateProjectProgress(project);
        return WorkflowResponse.fromEntity(savedWorkflow);
    }

    public WorkflowResponse assignCollaboratorToWorkflow(Long workflowId, String userEmail, String role, User projectManager) {
        // Validate that the user is a PROJECT_MANAGER
        if (!"PROJECT_MANAGER".equals(projectManager.getRole())) {
            throw new RuntimeException("Only PROJECT_MANAGER can assign collaborators to workflows");
        }

        Workflow workflow = getWorkflowEntity(workflowId);

        User collaborator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User with email " + userEmail + " not found"));

        if (!collaborator.getAvailability()) {
            throw new RuntimeException("Selected collaborator is not available");
        }
        if (role == null || role.trim().isEmpty()) {
            throw new RuntimeException("Role must be specified for the collaborator");
        }

        workflow.setUser(collaborator);
        collaborator.setRole(role); // Assign the specified role
        collaborator.setAvailability(false);
        userRepository.save(collaborator);

        Workflow updatedWorkflow = workflowRepository.save(workflow);
        handleWorkflowAlerts(updatedWorkflow);
        updateProjectProgress(updatedWorkflow.getProject());

        // Send email to the collaborator with project details
        try {
            String confirmationUrl = generateConfirmationUrl(workflowId, collaborator.getId());
            emailService.sendRoleAssignmentEmail(
                    collaborator.getEmail(),
                    collaborator.getName(),
                    updatedWorkflow.getProject().getName(),
                    updatedWorkflow.getName(),
                    role,
                    confirmationUrl,
                    "Confirm Your Role Assignment"
            );
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send role assignment email", e);
        }

        return WorkflowResponse.fromEntity(updatedWorkflow);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAvailableCollaborators() {
        List<User> availableUsers = userRepository.findByAvailability(true);
        return availableUsers.stream()
                .map(user -> new UserDTO(user.getId(), user.getName(), user.getAvailability(), user.getRole(), user.getEmail()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkflowResponse getWorkflowById(Long id) {
        Workflow workflow = getWorkflowEntity(id);
        return WorkflowResponse.fromEntity(workflow);
    }

    @Transactional(readOnly = true)
    public List<WorkflowResponse> getWorkflowsByProjectId(Long projectId) {
        Project project = projectService.getProjectEntity(projectId);
        return project.getWorkflows().stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public WorkflowResponse updateWorkflow(Long id, WorkflowUpdateRequest request) {
        Workflow workflow = getWorkflowEntity(id);
        if (request.name() != null) workflow.setName(request.name());
        if (request.description() != null) workflow.setDescription(request.description());
        if (request.status() != null) workflow.setStatus(request.status());
        if (request.projectId() != null) workflow.setProject(projectService.getProjectEntity(request.projectId()));

        Workflow updatedWorkflow = workflowRepository.save(workflow);
        handleWorkflowAlerts(updatedWorkflow);
        updateProjectProgress(updatedWorkflow.getProject());
        return WorkflowResponse.fromEntity(updatedWorkflow);
    }

    @Transactional
    public void deleteWorkflow(Long id) {
        Workflow workflow = getWorkflowEntity(id);
        Project project = workflow.getProject();
        if (project != null) {
            project.getWorkflows().remove(workflow);
        }
        workflowRepository.delete(workflow);
        if (project != null) {
            updateProjectProgress(project);
        }
    }

    private void handleWorkflowAlerts(Workflow workflow) {
        if ("COMPLETED".equalsIgnoreCase(workflow.getStatus())) {
            sendAlert("WORKFLOW", "COMPLETED", workflow.getName(), workflow.getCreatedAt());
        }
        if (workflow.getProgress() >= 100) {
            sendAlert("WORKFLOW", "PROGRESS_COMPLETE", workflow.getName(), null);
        }
    }

    private void sendAlert(String entityType, String alertType, String name, LocalDate date) {
        kafkaTemplate.send("workflow-alerts", new AlertEvent(entityType, alertType, name, date));
    }

    @Transactional(readOnly = true)
    public Workflow getWorkflowEntity(Long id) {
        return workflowRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.WorkflowNotFoundException(id));
    }

    public double calculateWorkflowProgress(Workflow workflow) {
        List<Task> tasks = workflow.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0.0;
        long completedTasks = tasks.stream()
                .filter(task -> "COMPLETED".equalsIgnoreCase(task.getStatus()))
                .count();
        return (completedTasks * 100.0) / tasks.size();
    }

    private double calculateProjectProgress(Project project) {
        List<Workflow> workflows = project.getWorkflows();
        if (workflows == null || workflows.isEmpty()) return 0.0;
        return workflows.stream()
                .mapToDouble(Workflow::getProgress)
                .average()
                .orElse(0.0);
    }

    private void updateProjectProgress(Project project) {
        double newProjectProgress = calculateProjectProgress(project);
        project.setProgress(newProjectProgress);
        updateProjectStatus(project, newProjectProgress);
        projectRepository.save(project);
    }

    public void updateWorkflowStatus(Workflow workflow, double progress) {
        if (progress == 100.0) {
            workflow.setStatus("COMPLETED");
        } else if (progress > 0.0) {
            workflow.setStatus("IN_PROGRESS");
        } else {
            workflow.setStatus("NOT_STARTED");
        }
    }

    private void updateProjectStatus(Project project, double progress) {
        if (progress == 100.0) {
            project.setStatus("COMPLETED");
        } else if (progress > 0.0) {
            project.setStatus("IN_PROGRESS");
        } else {
            project.setStatus("NOT_STARTED");
        }
    }

    public Workflow assignWorkflowToUser(Workflow workflow, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        workflow.setUser(user);
        return workflowRepository.save(workflow);
    }

    private String generateConfirmationUrl(Long workflowId, Long userId) {
        return "http://localhost:4200/workflows/" + workflowId + "/collaborators/confirm?userId=" + userId;
    }
}