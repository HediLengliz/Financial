package com.tensai.financial.Services;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Repositories.BudgetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.math.BigDecimal.ZERO;

@Service
@AllArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;

    public List<BudgetDTO> getAllBudgets() {
        return budgetRepository.findAll()
                .stream()
                .map(budget -> BudgetDTO.builder()
                        .id(budget.getId())
                        .projectName(budget.getProjectName())
                        .allocatedAmount(budget.getAllocatedAmount())
                        .spentAmount(budget.getSpentAmount())
                        .createdAt(budget.getCreatedAt())
                        .remainingAmount(budget.getRemainingAmount())
                        .transaction(budget.getTransaction())
                        .updatedAt(budget.getUpdatedAt())
                        .status(budget.getStatus())
                        .approval(budget.getApproval())
                        .currency(budget.getCurrency())
                        .projectId(budget.getProjectId())
                        .build())
                .collect(Collectors.toList());
    }

    public BudgetDTO createBudget(BudgetDTO dto) {
        Budget budget = Budget.builder()
                .projectName(dto.getProjectName())
                .allocatedAmount(dto.getAllocatedAmount())
                .spentAmount(dto.getSpentAmount())
                .createdAt(dto.getCreatedAt())
                .status(dto.getStatus())
                .remainingAmount(dto.getRemainingAmount())
                .updatedAt(dto.getUpdatedAt())
                .currency(dto.getCurrency())
//                .budgetStatus(BudgetStatus.)
                .transaction(dto.getTransaction())
                .approval(dto.getApproval())
                .projectId(dto.getProjectId())
                .build();
        Budget savedBudget = budgetRepository.save(budget);
        return BudgetDTO.builder()
                .id(savedBudget.getId())
                .projectName(savedBudget.getProjectName())
                .allocatedAmount(savedBudget.getAllocatedAmount())
                .spentAmount(savedBudget.getSpentAmount())
                .createdAt(savedBudget.getCreatedAt())
                .status(savedBudget.getStatus())
                .remainingAmount(savedBudget.getRemainingAmount())
                .updatedAt(savedBudget.getUpdatedAt())
                .currency(savedBudget.getCurrency())
//                .budgetStatus(savedBudget.getBudgetStatus())
                .approval(savedBudget.getApproval())
                .transaction(savedBudget.getTransaction())
                .projectId(savedBudget.getProjectId())
                .build();
    }
    public BudgetDTO updateBudget(UUID projectId, BudgetDTO dto) {
        Budget budget = budgetRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
//        if (budget.getRemainingAmount().compareTo(budget.getSpentAmount()) < 0) {
//            budget.setBudgetStatus(BudgetStatus.INSUFFICIENT);
//            throw new IllegalStateException("Insufficient budget");
//        }
//        if (budget.getRemainingAmount().compareTo(ZERO.floatValue()) == 0) {
//            budget.setBudgetStatus(BudgetStatus.EXCEEDED);
//            throw new IllegalStateException("Exceeded budget");
//        }
//        if (budget.getAllocatedAmount().compareTo((budget.getRemainingAmount())) > 0) {
//            budget.setBudgetStatus(BudgetStatus.SUFFICIENT);
//        }
        budget.setProjectName(dto.getProjectName());
        budget.setAllocatedAmount(dto.getAllocatedAmount());
        budget.setSpentAmount(dto.getSpentAmount());
        budget.setCreatedAt(dto.getCreatedAt());
        budget.setStatus(dto.getStatus());
        budget.setTransaction(dto.getTransaction());
        budget.setRemainingAmount(dto.getRemainingAmount());
        budget.setUpdatedAt(dto.getUpdatedAt());
        budget.setCurrency(dto.getCurrency());
        budget.setApproval(dto.getApproval());
        Budget savedBudget = budgetRepository.save(budget);
        return BudgetDTO.builder()
                .id(savedBudget.getId())
                .projectName(savedBudget.getProjectName())
                .allocatedAmount(savedBudget.getAllocatedAmount())
                .spentAmount(savedBudget.getSpentAmount())
                .createdAt(savedBudget.getCreatedAt())
                .status(savedBudget.getStatus())
                .remainingAmount(savedBudget.getRemainingAmount())
                .transaction(savedBudget.getTransaction())
                .updatedAt(savedBudget.getUpdatedAt())
                .approval(savedBudget.getApproval())
                .currency(savedBudget.getCurrency())
//                .budgetStatus(savedBudget.getBudgetStatus())
                .build();

    }
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
    public BudgetDTO getBudgetById(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return BudgetDTO.builder()
                .id(budget.getId())
                .projectName(budget.getProjectName())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .createdAt(budget.getCreatedAt())
                .status(budget.getStatus())
                .approval(budget.getApproval())
                .remainingAmount(budget.getRemainingAmount())
                .transaction(budget.getTransaction())
                .updatedAt(budget.getUpdatedAt())
                .currency(budget.getCurrency())
                .build();
    }
    public BudgetDTO getBudgetByStatus(Status status) {
        Budget budget = (Budget) budgetRepository.findByStatus(status)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return BudgetDTO.builder()
                .id(budget.getId())
                .projectName(budget.getProjectName())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .createdAt(budget.getCreatedAt())
                .status(budget.getStatus())
                .remainingAmount(budget.getRemainingAmount())
                .transaction(budget.getTransaction())
                .updatedAt(budget.getUpdatedAt())
                .approval(budget.getApproval())
                .currency(budget.getCurrency())
                .build();
    }
    public BudgetDTO getBudgetByProject(UUID projectId) {
        Budget budget = budgetRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Budget not found for project"));

        return new BudgetDTO();
    }

}
