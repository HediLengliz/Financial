package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.Budget;
import com.tensai.financial.DTOS.BudgetDTO;
public class BudgetMapper {
    public static BudgetDTO toDTO(Budget budget) {
        return BudgetDTO.builder()
                .id(budget.getId())
                .projectName(budget.getProjectName())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .remainingAmount(budget.getRemainingAmount())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .status(budget.getStatus())
                .transaction(budget.getTransaction())
                .approval(budget.getApproval())
                .currency(budget.getCurrency())
                .budgetStatus(budget.getBudgetStatus())
                .projectId(budget.getProjectId())
                .build();
    }

    public static Budget toEntity(BudgetDTO dto) {
        return Budget.builder()
                .id(dto.getId())
                .projectName(dto.getProjectName())
                .allocatedAmount(dto.getAllocatedAmount())
                .spentAmount(dto.getSpentAmount())
                .remainingAmount(dto.getRemainingAmount())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .status(dto.getStatus())
                .transaction(dto.getTransaction())
                .approval(dto.getApproval())
                .currency(dto.getCurrency())
                .budgetStatus(dto.getBudgetStatus())
                .projectId(dto.getProjectId())
                .build();
    }
}
