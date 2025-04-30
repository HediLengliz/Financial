package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateWorkflowRequest;
import com.tensai.projets.dtos.WorkflowResponse;
import com.tensai.projets.dtos.WorkflowUpdateRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.WorkflowRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final ProjectService projectService;

    public WorkflowService(WorkflowRepository workflowRepository, ProjectService projectService) {
        this.workflowRepository = workflowRepository;
        this.projectService = projectService;
    }

    // CREATE WORKFLOW
    public WorkflowResponse createWorkflow(CreateWorkflowRequest request) {
        Project project = projectService.getProjectEntity(request.projectId());
        if (project == null) {
            throw new RuntimeException("Project not found"); // Handle missing project
        }

        Workflow workflow = new Workflow();
        workflow.setName(request.name());
        workflow.setDescription(request.description());
        workflow.setStatus(request.status());
        workflow.setCreatedAt(LocalDate.now());// Initialize status
        workflow.setProject(project);

        project.getWorkflows().add(workflow); // Add workflow to project's workflows list

        Workflow savedWorkflow = workflowRepository.save(workflow);
        return WorkflowResponse.fromEntity(savedWorkflow);
    }

    // READ SINGLE WORKFLOW
    @Transactional(readOnly = true)
    public WorkflowResponse getWorkflowById(Long id) {
        Workflow workflow = getWorkflowEntity(id);
        return WorkflowResponse.fromEntity(workflow);
    }

    // READ ALL WORKFLOWS FOR A PROJECT
    @Transactional(readOnly = true)
    public List<WorkflowResponse> getWorkflowsByProjectId(Long projectId) {
        Project project = projectService.getProjectEntity(projectId);
        return project.getWorkflows().stream()
                .map(WorkflowResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // UPDATE WORKFLOW
    public WorkflowResponse updateWorkflow(Long id, WorkflowUpdateRequest request) {
        Workflow workflow = getWorkflowEntity(id);
        if (request.name() != null) workflow.setName(request.name());
        if (request.description() != null) workflow.setDescription(request.description());
        if (request.projectId() != null) {
            workflow.setProject(projectService.getProjectEntity(request.projectId()));
        }
        return WorkflowResponse.fromEntity(workflowRepository.save(workflow));
    }

    // DELETE WORKFLOW
    public void deleteWorkflow(Long id) {
        if (!workflowRepository.existsById(id)) {
            throw new GlobalExceptionHandler.WorkflowNotFoundException(id);
        }
        workflowRepository.deleteById(id);
    }

    // INTERNAL METHOD TO FETCH ENTITY
    @Transactional(readOnly = true)
    public Workflow getWorkflowEntity(Long id) {
        return workflowRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.WorkflowNotFoundException(id));
    }
}