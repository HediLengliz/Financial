package com.tensai.financial.Services;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.DTOS.BudgetMapper;
import com.tensai.financial.Entities.*;
import com.tensai.financial.Exceptions.ResourceNotFoundException;
import com.tensai.financial.Repositories.BudgetRepository;
import com.tensai.financial.Repositories.ExpenseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.math.BigDecimal.ZERO;

@Service
@AllArgsConstructor
public class BudgetService implements IBudgetService {
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public List<BudgetDTO> getAllBudgets() {
        return budgetRepository.findAll()
                .stream()
                .map(budget -> BudgetDTO.builder()
                        .id(budget.getId())
                        .projectName(budget.getProjectName())
                        .allocatedAmount(budget.getAllocatedAmount())
                        .spentAmount(budget.getSpentAmount())
                        .createdAt(budget.getCreatedAt())
                        .status(budget.getStatus())
                        .remainingAmount(budget.getRemainingAmount())
                        .updatedAt(budget.getUpdatedAt())
                        .currency(budget.getCurrency())
                        .transaction(budget.getTransaction())
                        .approval(budget.getApproval())
                        .budgetStatus(budget.getBudgetStatus())
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
                .transaction(dto.getTransaction())
                .approval(dto.getApproval())
                .projectId(dto.getProjectId())
                .budgetStatus(dto.getBudgetStatus())
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
                .budgetStatus(savedBudget.getBudgetStatus())
                .approval(savedBudget.getApproval())
                .transaction(savedBudget.getTransaction())
                .projectId(savedBudget.getProjectId())
                .build();
    }

    public BudgetDTO updateBudget(UUID projectId, BudgetDTO dto) {
        Budget budget = budgetRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        if (budget.getRemainingAmount().compareTo(budget.getSpentAmount()) < 0) {
            budget.setBudgetStatus(BudgetStatus.Insufficient);
            throw new IllegalStateException("Insufficient budget");
        }
        if (budget.getRemainingAmount().compareTo(ZERO) < 0) {
            budget.setBudgetStatus(BudgetStatus.Exceeded);
            throw new IllegalStateException("Exceeded budget");
        }
        if (budget.getAllocatedAmount().compareTo((budget.getRemainingAmount())) > 0) {
            budget.setBudgetStatus(BudgetStatus.Sufficient);
        }
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
        budget.setBudgetStatus(dto.getBudgetStatus());
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
                .budgetStatus(savedBudget.getBudgetStatus())
                .projectId(savedBudget.getProjectId())
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
                .remainingAmount(budget.getRemainingAmount())
                .transaction(budget.getTransaction())
                .updatedAt(budget.getUpdatedAt())
                .approval(budget.getApproval())
                .currency(budget.getCurrency())
                .budgetStatus(budget.getBudgetStatus())
                .projectId(budget.getProjectId())
                .build();
    }

    public BudgetDTO getBudgetByStatus(Status status) {
        Budget budget = budgetRepository.findByStatus(status)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return BudgetMapper.toDTO(budget);
    }

    public BudgetDTO getBudgetByProject(UUID projectId) {
        Budget budget = budgetRepository.findByProjectId(projectId)
                .orElseThrow(() -> new RuntimeException("Budget not found for project"));

        return new BudgetDTO();
    }

    //ken pm bech yfout el allocated budget tab3thlou notif talertih
    @Override
    public void checkBudgetThreshold(UUID projectId) {
        Budget budget = budgetRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        BigDecimal amount = expenseRepository.getTotalExpensesByProjectId(projectId);
        BigDecimal remainingBudget = budget.getAllocatedAmount().subtract(amount);
        if (remainingBudget.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalStateException("Budget exceeded! No more expenses allowed.");
        } else if (remainingBudget.compareTo(budget.getAllocatedAmount().multiply(new BigDecimal("0.15"))) < 0) {
            throw new IllegalStateException("Budget is about to exceed! Please be cautious.");
        }
    }


    private BudgetDTO mapToDTO(Budget budget) {
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
    public List<BudgetDTO> loadAllBudgetsWithFilters(
            String projectName,
            BigDecimal spentAmount,
            BigDecimal remainingAmount,
            LocalDate createdAt,
            LocalDate updatedAt,
            String transactionStr,
            String approvalStr,
            String budgetStatusStr,
            String status) {

        List<Budget> budgets = budgetRepository.findAll(); // Load all budgets

        // Filter based on provided criteria
        return budgets.stream()
                .filter(budget -> projectName == null || budget.getProjectName().contains(projectName))
                .filter(budget -> transactionStr == null || budget.getTransaction().name().equalsIgnoreCase(transactionStr))
                .filter(budget -> approvalStr == null || budget.getApproval().name().equalsIgnoreCase(approvalStr))
                .filter(budget -> budgetStatusStr == null || budget.getBudgetStatus().name().equalsIgnoreCase(budgetStatusStr))
                .filter(budget -> status == null || budget.getStatus().name().equalsIgnoreCase(status))
                .filter(budget -> spentAmount == null || budget.getSpentAmount().compareTo(spentAmount) == 0)
                .filter(budget -> remainingAmount == null || budget.getRemainingAmount().compareTo(remainingAmount) == 0)
                .filter(budget -> createdAt == null || budget.getCreatedAt().isEqual(createdAt))
                .filter(budget -> updatedAt == null || budget.getUpdatedAt().isEqual(updatedAt))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    //filter function for budgets ps: i havent tried without the toDTO expression it will remain for testing



}
