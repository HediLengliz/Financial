package com.tensai.financial.Repositories;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository  extends JpaRepository<Budget,Long> {
    Optional<Budget> findByProjectId(UUID projectId);
    Optional<Budget> findByStatus(Status status);
    Optional<Budget> findById(Long id);
    @Query("SELECT b FROM Budget b WHERE " +
            "(:projectName IS NULL OR b.projectName LIKE %:projectName%) " +
            "AND (:amount IS NULL OR b.allocatedAmount = :amount OR b.spentAmount = :amount OR b.remainingAmount = :amount) " +
            "AND (:startDate IS NULL OR b.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR b.updatedAt <= :endDate) " + // Fixed to use updatedAt
            "AND (:status IS NULL OR b.status = :status) " +
            "AND (:transaction IS NULL OR b.transaction = :transaction) " +
            "AND (:budgetStatus IS NULL OR b.budgetStatus = :budgetStatus) " +
            "AND (:approval IS NULL OR b.approval = :approval)")
    List<Budget> findAllByFilters(
            @Param("projectName") String projectName,
            @Param("amount") BigDecimal amount,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") String status,
            @Param("transaction") Transaction transaction,
            @Param("budgetStatus") BudgetStatus budgetStatus,
            @Param("approval") ApprovalStatus approval);
}
