package com.tensai.financial.Repositories;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository  extends JpaRepository<Budget,Long> {
    Optional<Budget> findByProjectId(UUID projectId);
    Optional<Budget> findByStatus(Status status);
}
