package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateWorkflowRequest;
import com.tensai.projets.dtos.WorkflowResponse;
import com.tensai.projets.dtos.WorkflowUpdateRequest;
import com.tensai.projets.services.WorkflowService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;

    public WorkflowController(WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    // CREATE WORKFLOW
    @PostMapping
    public ResponseEntity<WorkflowResponse> createWorkflow(@RequestBody CreateWorkflowRequest request) {
        WorkflowResponse response = workflowService.createWorkflow(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET WORKFLOWS FOR A PROJECT
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<WorkflowResponse>> getWorkflowsByProjectId(@PathVariable Long projectId) {
        List<WorkflowResponse> responseList = workflowService.getWorkflowsByProjectId(projectId);
        return ResponseEntity.ok(responseList);
    }

    // READ SINGLE WORKFLOW
    @GetMapping("/{id}")
    public ResponseEntity<WorkflowResponse> getWorkflowById(@PathVariable Long id) {
        WorkflowResponse response = workflowService.getWorkflowById(id);
        return ResponseEntity.ok(response);
    }

    // UPDATE WORKFLOW
    @PutMapping("/{id}")
    public ResponseEntity<WorkflowResponse> updateWorkflow(
            @PathVariable Long id,
            @RequestBody WorkflowUpdateRequest request) {
        WorkflowResponse response = workflowService.updateWorkflow(id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE WORKFLOW
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }
}