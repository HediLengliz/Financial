package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Expense;
import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE e.status = ?1")
    Expense getExpenseByStatus(Status status);
    Optional<Expense> findByStatus(Status status);


    @Query("SELECT e FROM Expense e WHERE e.id = ?1")
    Expense getExpenseById(Long id);

    @Query("SELECT e FROM Expense e WHERE e.description = ?1")
    Expense getExpenseByDescription(String description);

    @Query("SELECT e FROM Expense e WHERE e.amount = ?1")
    Expense getExpenseByAmount(Double amount);
    List<Expense> findByBudgetId(Long budgetId);
    BigDecimal getTotalExpensesByProjectId(UUID projectId);
    Boolean existsByProjectIdAndSupplierIdAndAmountAndCreatedAt(UUID projectId, UUID supplierId, BigDecimal amount, LocalDate createdAt);


    List<Expense> findExpensesByProjectId(UUID projectId);
}
