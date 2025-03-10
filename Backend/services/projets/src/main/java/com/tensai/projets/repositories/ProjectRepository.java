package com.tensai.projets.repositories;

import com.tensai.projets.models.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // src/main/java/com/tensai/projets/repositories/ProjectRepository.java
    // Add these methods to your ProjectRepository interface
    // In ProjectRepository
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.workflows WHERE p.id = :id")
    Optional<Project> findByIdWithWorkflows(Long id);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.workflows")
    List<Project> findAllWithWorkflows();
}
