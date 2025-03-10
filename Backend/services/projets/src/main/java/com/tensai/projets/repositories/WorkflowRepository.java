package com.tensai.projets.repositories;

import com.tensai.projets.models.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long>, JpaSpecificationExecutor<Workflow> {
    @Query("SELECT w FROM Workflow w LEFT JOIN FETCH w.tasks WHERE w.project.id = :projectId")
    List<Workflow> findWithTasksByProjectId(Long projectId);
}
