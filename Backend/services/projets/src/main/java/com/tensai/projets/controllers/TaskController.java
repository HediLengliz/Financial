package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateTaskRequest;
import com.tensai.projets.dtos.TaskResponse;
import com.tensai.projets.dtos.UpdateTaskRequest;
import com.tensai.projets.models.User;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Task;
import com.tensai.projets.repositories.WorkflowRepository;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.services.TaskService;
import com.tensai.projets.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/{workflowId}/tasks")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long workflowId,
            @RequestBody CreateTaskRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        validateWorkflowAccess(workflowId, jwt);
        TaskResponse createdTask = taskService.createTask(request);
        return ResponseEntity.ok(createdTask);
    }

    @GetMapping("/workflow/{workflowId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<List<TaskResponse>> getTasksByWorkflowId(
            @PathVariable Long workflowId,
            @AuthenticationPrincipal Jwt jwt) {
        validateWorkflowAccess(workflowId, jwt);
        List<TaskResponse> tasks = taskService.getTasksByWorkflowId(workflowId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<TaskResponse> getTaskById(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Jwt jwt) {
        validateTaskAccess(taskId, jwt);
        TaskResponse task = taskService.getTaskById(taskId);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @RequestBody UpdateTaskRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        validateTaskAccess(taskId, jwt);
        TaskResponse updatedTask = taskService.updateTask(taskId, request);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long taskId,
            @AuthenticationPrincipal Jwt jwt) {
        validateTaskAccess(taskId, jwt);
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{taskId}/status")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestBody String status,
            @AuthenticationPrincipal Jwt jwt) {
        validateTaskAccess(taskId, jwt);
        taskService.updateTaskStatus(taskId, status);
        return ResponseEntity.noContent().build();
    }

    private void validateWorkflowAccess(Long workflowId, Jwt jwt) {
        Long userId = extractUserId(jwt);
        Optional<Workflow> workflowOpt = workflowRepository.findById(workflowId);
        if (workflowOpt.isEmpty()) {
            throw new RuntimeException("Workflow not found with ID: " + workflowId);
        }
        Workflow workflow = workflowOpt.get();
        Project project = workflow.getProject();
        if (project == null ||
                (project.getProjectManager() == null || !project.getProjectManager().getId().equals(userId)) &&
                        (project.getProjectOwner() == null || !project.getProjectOwner().getId().equals(userId))) {
            throw new RuntimeException("User not authorized to access workflow: " + workflowId);
        }
    }

    private void validateTaskAccess(Long taskId, Jwt jwt) {
        Long userId = extractUserId(jwt);
        Optional<Task> taskOpt = Optional.ofNullable(taskService.getTaskEntity(taskId));
        if (taskOpt.isEmpty()) {
            throw new RuntimeException("Task not found with ID: " + taskId);
        }
        Task task = taskOpt.get();
        Workflow workflow = task.getWorkflow();
        Project project = workflow.getProject();
        if (project == null ||
                (project.getProjectManager() == null || !project.getProjectManager().getId().equals(userId)) &&
                        (project.getProjectOwner() == null || !project.getProjectOwner().getId().equals(userId))) {
            throw new RuntimeException("User not authorized to access task: " + taskId);
        }
    }

    private Long extractUserId(Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt); // Use UserService to resolve user
        if (user == null || user.getId() == null) {
            throw new RuntimeException("Unable to resolve user ID from JWT token");
        }
        return user.getId();
    }
}