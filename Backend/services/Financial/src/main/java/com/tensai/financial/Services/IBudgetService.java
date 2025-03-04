package com.tensai.financial.Services;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IBudgetService {
    List<BudgetDTO> getAllBudgets();
    BudgetDTO createBudget(BudgetDTO dto);
    BudgetDTO updateBudget(UUID projectId, BudgetDTO dto);
    void deleteBudget(Long id);
    BudgetDTO getBudgetById(Long id);
    BudgetDTO getBudgetByStatus(Status status);
    BudgetDTO getBudgetByProject(UUID projectId);
    public void checkBudgetThreshold(UUID projectId);
    public List<BudgetDTO> loadAllBudgetsWithFilters(
            String projectName,
            BigDecimal spentAmount,
            BigDecimal remainingAmount,
            LocalDate createdAt,
            LocalDate updatedAt,
            String transactionStr,
            String approvalStr,
            String budgetStatusStr,
            String status);
}
