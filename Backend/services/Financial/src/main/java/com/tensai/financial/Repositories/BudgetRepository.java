package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BudgetRepository  extends JpaRepository<Budget,Long> {
    Optional<Object> findByStatus(String status);
}
