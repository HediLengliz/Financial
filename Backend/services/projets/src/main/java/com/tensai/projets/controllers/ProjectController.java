package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.dtos.ProjectResponseDTO;
import com.tensai.projets.dtos.UpdateProjectRequest;
import com.tensai.projets.dtos.UserDTO;
import com.tensai.projets.dtos.PredictionResultDTO;
import com.tensai.projets.dtos.WorkflowResponse;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.User;
import com.tensai.projets.models.Workflow;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.services.FileStorageService;
import com.tensai.projets.services.ProjectService;
import com.tensai.projets.services.UserService;
import com.tensai.projets.services.WorkflowService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.hc.client5.http.utils.Base64;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/projects")
public class ProjectController {
    private final ProjectService projectService;
    private final FileStorageService fileStorageService;
    private final WorkflowService workflowService;
    private final ProjectRepository projectRepository;
    private final SpringTemplateEngine templateEngine;
    private final UserService userService; // Added to fetch user from JWT

    public ProjectController(ProjectService projectService, FileStorageService fileStorageService,
                             WorkflowService workflowService, ProjectRepository projectRepository,
                             SpringTemplateEngine templateEngine, UserService userService) {
        this.projectService = projectService;
        this.fileStorageService = fileStorageService;
        this.workflowService = workflowService;
        this.projectRepository = projectRepository;
        this.templateEngine = templateEngine;
        this.userService = userService;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PROJECT_OWNER')") // Restrict to PROJECT_OWNER
    public ResponseEntity<ProjectResponseDTO> createProject(
            @Valid @ModelAttribute CreateProjectRequest request,
            @RequestParam("projectManagerId") Long projectManagerId,
            @AuthenticationPrincipal Jwt jwt) {
        User projectOwner = userService.syncUserFromJwt(jwt); // Get authenticated user
        ProjectResponseDTO response = projectService.createProject(request, projectManagerId, projectOwner);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/available-managers")
    public ResponseEntity<List<UserDTO>> getAvailableProjectManagers() {
        List<UserDTO> availableManagers = projectService.getAvailableProjectManagers();
        return ResponseEntity.ok(availableManagers);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_OWNER')")
    public ResponseEntity<ProjectResponseDTO> getProjectById(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User projectOwner = userService.syncUserFromJwt(jwt);
        ProjectResponseDTO response = projectService.getProjectById(id, projectOwner);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/projects")
    @PreAuthorize("hasRole('PROJECT_OWNER')")
    public ResponseEntity<List<ProjectResponseDTO>> getProjects(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @AuthenticationPrincipal Jwt jwt) {
        User projectOwner = userService.syncUserFromJwt(jwt);
        List<ProjectResponseDTO> response = projectService.getProjects(keyword, status, priority, projectOwner);
        return ResponseEntity.ok(response);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('PROJECT_OWNER')")
    public ResponseEntity<ProjectResponseDTO> updateProject(
            @PathVariable Long id,
            @Valid @ModelAttribute UpdateProjectRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        User projectOwner = userService.syncUserFromJwt(jwt);
        ProjectResponseDTO response = projectService.updateProject(id, request, projectOwner);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROJECT_OWNER')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        User projectOwner = userService.syncUserFromJwt(jwt);
        projectService.deleteProject(id, projectOwner);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        Resource file = fileStorageService.loadImage(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @GetMapping("/{projectId}/workflows")
    public ResponseEntity<List<WorkflowResponse>> getWorkflowsByProjectId(@PathVariable Long projectId) {
        List<WorkflowResponse> workflows = workflowService.getWorkflowsByProjectId(projectId);
        return ResponseEntity.ok(workflows);
    }

    @GetMapping("/{id}/progress")
    public ResponseEntity<Double> getProjectProgress(@PathVariable Long id) {
        Project project = projectService.getProjectEntity(id);
        List<Workflow> workflows = workflowService.getWorkflowsByProjectId(id)
                .stream()
                .map(w -> workflowService.getWorkflowEntity(w.id()))
                .collect(Collectors.toList());
        project.getWorkflows().clear();
        project.getWorkflows().addAll(workflows);

        double progress = projectService.calculateProjectProgress(project);
        project.setProgress(progress);
        projectService.updateProjectStatus(project, progress);
        projectRepository.save(project);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generateProjectPdf(@PathVariable Long id) throws Exception {
        Project project = projectService.getProjectEntity(id);
        Context context = new Context();
        context.setVariable("project", project);

        if (project.getImagePath() != null && !project.getImagePath().isEmpty()) {
            try {
                Resource imageResource = fileStorageService.loadImage(project.getImagePath());
                byte[] imageBytes = Files.readAllBytes(imageResource.getFile().toPath());
                String base64Image = Base64.encodeBase64String(imageBytes);
                String imageMimeType = Files.probeContentType(imageResource.getFile().toPath());
                if (imageMimeType == null) {
                    imageMimeType = "image/jpeg";
                }
                String imageDataUrl = "data:" + imageMimeType + ";base64," + base64Image;
                context.setVariable("imageDataUrl", imageDataUrl);
            } catch (IOException e) {
                context.setVariable("imageDataUrl", "");
                System.err.println("Failed to load image: " + e.getMessage());
            }
        } else {
            context.setVariable("imageDataUrl", "");
        }

        String html = templateEngine.process("project-overview.pdf.html", context);
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        renderer.createPDF(out);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "project-overview.pdf");
        return new ResponseEntity<>(out.toByteArray(), headers, HttpStatus.OK);
    }

    @GetMapping("/{id}/predict")
    public ResponseEntity<PredictionResultDTO> predictProjectDetails(@PathVariable Long id) {
        PredictionResultDTO prediction = projectService.predictProjectDetails(id);
        return ResponseEntity.ok(prediction);
    }
}