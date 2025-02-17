package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateTaskRequest;
import com.tensai.projets.dtos.TaskResponse;
import com.tensai.projets.dtos.UpdateTaskRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Task;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.TaskRepository;
import com.tensai.projets.repositories.WorkflowRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final WorkflowService workflowService;

    public TaskService(TaskRepository taskRepository, WorkflowService workflowService) {
        this.taskRepository = taskRepository;
        this.workflowService = workflowService;
    }

    // CREATE TASK
    public TaskResponse createTask(CreateTaskRequest request) {
        Workflow workflow = workflowService.getWorkflowEntity(request.workflowId());
        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority());
        task.setEstimatedHours(request.estimatedHours());
        task.setAssigneeId(request.assigneeId());
        task.setOrderInWorkflow(request.orderInWorkflow());
        task.setWorkflow(workflow);

        workflow.getTasks().add(task); // Add task to workflow's tasks list

        Task savedTask = taskRepository.save(task);
        return TaskResponse.fromEntity(savedTask);
    }

    // READ SINGLE TASK
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = getTaskEntity(id);
        return TaskResponse.fromEntity(task);
    }

    // READ ALL TASKS FOR A WORKFLOW
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByWorkflowId(Long workflowId) {
        Workflow workflow = workflowService.getWorkflowEntity(workflowId);
        return workflow.getTasks().stream()
                .map(TaskResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // UPDATE TASK
    public TaskResponse updateTask(Long id, UpdateTaskRequest request) {
        Task task = getTaskEntity(id);
        if (request.title() != null) task.setTitle(request.title());
        if (request.description() != null) task.setDescription(request.description());
        if (request.dueDate() != null) task.setDueDate(request.dueDate());
        if (request.priority() != null) task.setPriority(request.priority());
        if (request.estimatedHours() != null) task.setEstimatedHours(request.estimatedHours());
        if (request.assigneeId() != null) task.setAssigneeId(request.assigneeId());
        if (request.orderInWorkflow() != null) task.setOrderInWorkflow(request.orderInWorkflow());
        if (request.workflowId() != null) task.setWorkflow(workflowService.getWorkflowEntity(request.workflowId()));

        return TaskResponse.fromEntity(taskRepository.save(task));
    }

    // DELETE TASK
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new GlobalExceptionHandler.TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }

    // INTERNAL METHOD TO FETCH ENTITY
    @Transactional(readOnly = true)
    public Task getTaskEntity(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.TaskNotFoundException(id));
    }
}