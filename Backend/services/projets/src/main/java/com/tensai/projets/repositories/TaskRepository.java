package com.tensai.projets.repositories;

import com.tensai.projets.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
    @Query("SELECT t FROM Task t WHERE t.workflow.id IN :workflowIds")
    List<Task> findByWorkflowIds(List<Long> workflowIds);
    List<Task> findByDueDateBetween(LocalDate start, LocalDate end);

}