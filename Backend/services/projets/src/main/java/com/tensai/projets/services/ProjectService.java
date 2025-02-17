package com.tensai.projets.services;

import com.tensai.projets.dtos.CreateProjectRequest;
import com.tensai.projets.dtos.ProjectResponseDTO;
import com.tensai.projets.dtos.UpdateProjectRequest;
import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.repositories.ProjectRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    // CREATE PROJECT
    public ProjectResponseDTO createProject(String name, String description) {
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setWorkflows(List.of()); // Initialize an empty list of workflows
        return ProjectResponseDTO.fromEntity(projectRepository.save(project));
    }

    // READ SINGLE PROJECT
    @Transactional(readOnly = true)
    public ProjectResponseDTO getProjectById(Long id) {
        Project project = getProjectEntity(id);
        return ProjectResponseDTO.fromEntity(project);
    }

    // READ ALL PROJECTS
    @Transactional(readOnly = true)
    public List<ProjectResponseDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(ProjectResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // UPDATE PROJECT
    public ProjectResponseDTO updateProject(Long id, UpdateProjectRequest request) {
        Project project = getProjectEntity(id);
        if (request.name() != null) project.setName(request.name());
        if (request.description() != null) project.setDescription(request.description());
        return ProjectResponseDTO.fromEntity(projectRepository.save(project));
    }

    // DELETE PROJECT
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new GlobalExceptionHandler.ProjectNotFoundException(id);
        }
        projectRepository.deleteById(id);
    }

    // INTERNAL METHOD TO FETCH ENTITY
    @Transactional(readOnly = true)
    public Project getProjectEntity(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));
    }
}