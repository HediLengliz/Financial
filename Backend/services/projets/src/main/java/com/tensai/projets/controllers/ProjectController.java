package com.tensai.projets.controllers;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.models.Project;
import com.tensai.projets.services.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects")
 // Lombok annotation
public class ProjectController {

    private final ProjectService projectService;
    ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody CreateProjectRequest request) {
        return projectService.createProject(request.name(), request.description());
    }

    @GetMapping("/{id}")
    public Project getProject(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
}