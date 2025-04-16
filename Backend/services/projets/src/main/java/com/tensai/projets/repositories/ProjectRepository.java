package com.tensai.projets.repositories;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Fetch a project by ID with its workflows
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.workflows WHERE p.id = :id")
    Optional<Project> findByIdWithWorkflows(@Param("id") Long id);

    // Fetch all projects with their workflows
    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.workflows")
    List<Project> findAllWithWorkflows();

    // Find projects with end dates in a given range
    List<Project> findByEndDateBetween(LocalDate start, LocalDate end);

    // Fetch a project by ID with its project manager
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.projectManager WHERE p.id = :id")
    Optional<Project> findByIdWithManager(@Param("id") Long id);

    // Find projects by project owner with workflows
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.workflows WHERE p.projectOwner = :owner")
    List<Project> findByProjectOwner(@Param("owner") User owner);

    // Find all projects with workflows by owner (redundant but kept for compatibility)
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.workflows WHERE p.projectOwner = :owner")
    List<Project> findAllWithWorkflowsByOwner(@Param("owner") User owner);

    // Find projects by project manager ID
    @Query("SELECT p FROM Project p WHERE p.projectManager.id = :projectManagerId")
    List<Project> findByProjectManagerId(@Param("projectManagerId") Long projectManagerId);

    // Find projects by project owner ID
    @Query("SELECT p FROM Project p WHERE p.projectOwner.id = :projectOwnerId")
    List<Project> findByProjectOwnerId(@Param("projectOwnerId") Long projectOwnerId);
    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.workflows WHERE p.projectManager = :projectManager")
    List<Project> findByProjectManager(@Param("projectManager") User projectManager);
}