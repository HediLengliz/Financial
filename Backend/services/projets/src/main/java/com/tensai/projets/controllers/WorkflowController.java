package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateWorkflowRequest;
import com.tensai.projets.dtos.UserDTO;
import com.tensai.projets.dtos.WorkflowResponse;
import com.tensai.projets.dtos.WorkflowUpdateRequest;
import com.tensai.projets.models.User;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.WorkflowRepository;
import com.tensai.projets.services.UserService;
import com.tensai.projets.services.WorkflowService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {

    private final WorkflowService workflowService;
    private final WorkflowRepository workflowRepository;
    private final UserService userService; // Added to fetch user from JWT

    public WorkflowController(WorkflowService workflowService, WorkflowRepository workflowRepository, UserService userService) {
        this.workflowService = workflowService;
        this.workflowRepository = workflowRepository;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<WorkflowResponse> createWorkflow(
            @RequestBody CreateWorkflowRequest request,
            @RequestParam(required = false) Long userId) {
        WorkflowResponse response = workflowService.createWorkflow(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/available-collaborators")
    public ResponseEntity<List<UserDTO>> getAvailableCollaborators() {
        List<UserDTO> response = workflowService.getAvailableCollaborators();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{workflowId}/collaborators")
    @PreAuthorize("hasRole('PROJECT_MANAGER')") // Restrict to PROJECT_MANAGER
    public ResponseEntity<WorkflowResponse> assignCollaborator(
            @PathVariable Long workflowId,
            @RequestParam String email,
            @RequestParam String role,
            @AuthenticationPrincipal Jwt jwt) {
        User projectManager = userService.syncUserFromJwt(jwt); // Get authenticated user
        WorkflowResponse response = workflowService.assignCollaboratorToWorkflow(workflowId, email, role, projectManager);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<WorkflowResponse>> getWorkflowsByProjectId(@PathVariable Long projectId) {
        List<WorkflowResponse> responseList = workflowService.getWorkflowsByProjectId(projectId);
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowResponse> getWorkflowById(@PathVariable Long id) {
        WorkflowResponse response = workflowService.getWorkflowById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkflowResponse> updateWorkflow(
            @PathVariable Long id,
            @RequestBody WorkflowUpdateRequest request) {
        WorkflowResponse response = workflowService.updateWorkflow(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<Double> getWorkflowProgress(@PathVariable Long id) {
        Workflow workflow = workflowService.getWorkflowEntity(id);
        double progress = workflowService.calculateWorkflowProgress(workflow);
        workflow.setProgress(progress);
        workflowService.updateWorkflowStatus(workflow, progress);
        workflowRepository.save(workflow);
        return ResponseEntity.ok(progress);
    }
}