package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateTaskRequest;
import com.tensai.projets.dtos.TaskResponse;
import com.tensai.projets.dtos.UpdateTaskRequest;
import com.tensai.projets.services.TaskService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // CREATE TASK
    @PostMapping("/{workflowId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long workflowId,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskService.createTask(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET TASKS FOR A WORKFLOW
    @GetMapping("/workflow/{workflowId}")
    public ResponseEntity<List<TaskResponse>> getTasksByWorkflowId(@PathVariable Long workflowId) {
        List<TaskResponse> responseList = taskService.getTasksByWorkflowId(workflowId);
        return ResponseEntity.ok(responseList);
    }

    // READ SINGLE TASK
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        TaskResponse response = taskService.getTaskById(id);
        return ResponseEntity.ok(response);
    }

    // UPDATE TASK
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTaskRequest request) {
        TaskResponse response = taskService.updateTask(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE TASK
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}