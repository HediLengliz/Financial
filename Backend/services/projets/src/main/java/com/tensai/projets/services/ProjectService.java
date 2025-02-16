package com.tensai.projets.services;

import com.tensai.projets.exceptions.GlobalExceptionHandler;
import com.tensai.projets.models.Project;
import com.tensai.projets.repositories.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
 // Lombok annotation
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public Project createProject(String name, String description) {
        return projectRepository.save(new Project(name, description));
    }

    @Transactional(readOnly = true)
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new GlobalExceptionHandler.ProjectNotFoundException(id));
    }
}