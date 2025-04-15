package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateTaskRequest;
import com.tensai.projets.dtos.TaskResponse;
import com.tensai.projets.dtos.UpdateTaskRequest;
import com.tensai.projets.dtos.AlertEvent;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Task;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.TaskRepository;
import com.tensai.projets.repositories.WorkflowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final WorkflowService workflowService;
    private final WorkflowRepository workflowRepository;
    private final ProjectRepository projectRepository;
    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;

    @Autowired
    public TaskService(TaskRepository taskRepository,
                       WorkflowService workflowService,
                       WorkflowRepository workflowRepository,
                       ProjectRepository projectRepository,
                       KafkaTemplate<String, AlertEvent> kafkaTemplate) {
        this.taskRepository = taskRepository;
        this.workflowService = workflowService;
        this.workflowRepository = workflowRepository;
        this.projectRepository = projectRepository;
        this.kafkaTemplate = kafkaTemplate;
    }

    public TaskResponse createTask(CreateTaskRequest request) {
        Workflow workflow = workflowService.getWorkflowEntity(request.workflowId());
        int maxOrder = workflow.getTasks().stream()
                .mapToInt(Task::getOrderInWorkflow)
                .max()
                .orElse(0);

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setStatus("IN_PROGRESS");
        task.setPriority(request.priority() != null ? request.priority().toUpperCase() : null);
        task.setEstimatedHours(request.estimatedHours());
        task.setAssigneeId(request.assigneeId());
        task.setOrderInWorkflow(maxOrder + 1);
        task.setWorkflow(workflow);

        Task savedTask = taskRepository.save(task);
        handleTaskAlerts(savedTask);
        updateProgressChain(savedTask);
        return TaskResponse.fromEntity(savedTask);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = getTaskEntity(id);
        return TaskResponse.fromEntity(task);
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByWorkflowId(Long workflowId) {
        Workflow workflow = workflowService.getWorkflowEntity(workflowId);
        return workflow.getTasks().stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = getTaskEntity(id);
        String originalStatus = task.getStatus();
        Workflow originalWorkflow = task.getWorkflow();

        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.dueDate() != null) task.setDueDate(request.dueDate());
        if (request.status() != null) task.setStatus(request.status());
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.estimatedHours() != null) task.setEstimatedHours(request.estimatedHours());
        if (request.assigneeId() != null) task.setAssigneeId(request.assigneeId());
        if (request.orderInWorkflow() != null) task.setOrderInWorkflow(request.orderInWorkflow());
        if (request.workflowId() != null) task.setWorkflow(workflowService.getWorkflowEntity(request.workflowId()));

        Task updatedTask = taskRepository.save(task);
        handleTaskAlerts(updatedTask);

        if (originalWorkflow != null && !task.getWorkflow().getId().equals(originalWorkflow.getId())) {
            Workflow oldWorkflow = workflowService.getWorkflowEntity(originalWorkflow.getId());
            double oldWorkflowProgress = calculateWorkflowProgress(oldWorkflow);
            oldWorkflow.setProgress(oldWorkflowProgress);
            updateWorkflowStatus(oldWorkflow, oldWorkflowProgress);
            workflowRepository.save(oldWorkflow);
            updateProgressChain(updatedTask);
        } else if (request.status() != null && !originalStatus.equals(task.getStatus())) {
            updateProgressChain(updatedTask);
        }

        return TaskResponse.fromEntity(updatedTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        Task task = getTaskEntity(id);
        Workflow workflow = task.getWorkflow();
        if (workflow != null) {
            workflow.getTasks().remove(task);
        }
        taskRepository.delete(task);
        if (workflow != null) {
            updateProgressChainForWorkflow(workflow);
        }
    }

    public void updateTaskStatus(Long taskId, String newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new GlobalExceptionHandler.TaskNotFoundException(taskId));
        task.setStatus(newStatus);
        Task updatedTask = taskRepository.save(task);
        handleTaskAlerts(updatedTask);
        updateProgressChain(updatedTask);
    }

    private void handleTaskAlerts(Task task) {
        if ("COMPLETED".equalsIgnoreCase(task.getStatus())) {
            sendAlert("TASK", "COMPLETED", task.getTitle(), null);
        } else {
            if ("HIGH".equalsIgnoreCase(task.getPriority())) {
                sendAlert("TASK", "HIGH_PRIORITY", task.getTitle(), null);
            }
            if (task.getDueDate() != null && isWithinDays(task.getDueDate(), 5)) {
                sendAlert("TASK", "DEADLINE_SOON", task.getTitle(), task.getDueDate());
            }
        }
    }

    private void updateProgressChain(Task task) {
        Workflow workflow = task.getWorkflow();
        double newWorkflowProgress = calculateWorkflowProgress(workflow);
        workflow.setProgress(newWorkflowProgress);
        updateWorkflowStatus(workflow, newWorkflowProgress);
        workflowRepository.save(workflow);

        Project project = workflow.getProject();
        double newProjectProgress = calculateProjectProgress(project);
        project.setProgress(newProjectProgress);
        updateProjectStatus(project, newProjectProgress);
        projectRepository.save(project);
    }

    private void updateProgressChainForWorkflow(Workflow workflow) {
        double newWorkflowProgress = calculateWorkflowProgress(workflow);
        workflow.setProgress(newWorkflowProgress);
        updateWorkflowStatus(workflow, newWorkflowProgress);
        workflowRepository.save(workflow);

        Project project = workflow.getProject();
        double newProjectProgress = calculateProjectProgress(project);
        project.setProgress(newProjectProgress);
        updateProjectStatus(project, newProjectProgress);
        projectRepository.save(project);
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

    private void updateProjectStatus(Project project, double progress) {
        if (progress == 100.0) {
            project.setStatus("COMPLETED");
        } else if (progress > 0.0) {
            project.setStatus("IN_PROGRESS");
        } else {
            project.setStatus("NOT_STARTED");
        }
    }

    private boolean isWithinDays(LocalDate date, int days) {
        return date != null && ChronoUnit.DAYS.between(LocalDate.now(), date) <= days;
    }

    private void sendAlert(String entityType, String alertType, String name, LocalDate date) {
        kafkaTemplate.send("task-alerts", new AlertEvent(entityType, alertType, name, date));
    }

    @Transactional(readOnly = true)
    public Task getTaskEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.TaskNotFoundException(id));
    }

    private double calculateWorkflowProgress(Workflow workflow) {
        List<Task> tasks = workflow.getTasks();
        if (tasks == null || tasks.isEmpty()) return 0.0;
        long completedTasks = tasks.stream()
                .filter(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))
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
}