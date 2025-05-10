package com.tensai.financial.Repositories;

import com.tensai.financial.Entities.Expense;
import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE e.status = ?1")
    Expense getExpenseByStatus(Status status);
    List<Expense> findByStatus(Status status);


    @Query("SELECT e FROM Expense e WHERE e.id = ?1")
    Expense getExpenseById(Long id);

    @Query("SELECT e FROM Expense e WHERE e.description = ?1")
    Expense getExpenseByDescription(String description);

    @Query("SELECT e FROM Expense e WHERE e.amount = ?1")
    Expense getExpenseByAmount(Double amount);
    List<Expense> findByBudgetId(Long budgetId);
    BigDecimal getTotalExpensesByProjectId(UUID projectId);
//    Boolean existsByProjectIdAndSupplierIdAndAmountAndCreatedAt(UUID projectId, BigDecimal amount, LocalDate createdAt);


    List<Expense> findExpensesByProjectId(UUID projectId);

    @Query("SELECT e FROM Expense e WHERE " +
            "(:description IS NULL OR e.description LIKE %:description%) " +
            "AND (:amount IS NULL OR e.amount = :amount) " +
            "AND (:createdAt IS NULL OR e.createdAt =  :createdAt) " +
            "AND (:updatedAt IS NULL OR e.updatedAt =  :updatedAt) " +
            "AND (:category IS NULL OR e.category LIKE %:category%) " +
            "AND (:status IS NULL OR e.status = :status) " +
            "AND (:projectId IS NULL OR e.projectId = :projectId)")
    List<Expense> findAllByFilters(
            @Param("description") String description,
            @Param("amount") BigDecimal amount,
            @Param("createdAt") LocalDate createdAt,
            @Param("updatedAt") LocalDate updatedAt,
            @Param("category") String category,
            @Param("status") Status status,
            @Param("projectId") UUID projectId);

    List<Expense> findExpenseByBudgetId(Long id);
}
