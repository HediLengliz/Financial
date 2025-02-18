package com.tensai.financial.Services;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Repositories.BudgetRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
                        .build())
                .collect(Collectors.toList());
    }

    public BudgetDTO createBudget(BudgetDTO dto) {
        Budget budget = Budget.builder()
                .projectName(dto.getProjectName())
                .allocatedAmount(dto.getAllocatedAmount())
                .spentAmount(dto.getSpentAmount())
                .createdAt(dto.getCreatedAt())
                .build();
        Budget savedBudget = budgetRepository.save(budget);
        return BudgetDTO.builder()
                .id(savedBudget.getId())
                .projectName(savedBudget.getProjectName())
                .allocatedAmount(savedBudget.getAllocatedAmount())
                .spentAmount(savedBudget.getSpentAmount())
                .createdAt(savedBudget.getCreatedAt())
                .build();
    }
    public BudgetDTO updateBudget(Long id, BudgetDTO dto) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budget.setProjectName(dto.getProjectName());
        budget.setAllocatedAmount(dto.getAllocatedAmount());
        budget.setSpentAmount(dto.getSpentAmount());
        budget.setCreatedAt(dto.getCreatedAt());
        Budget savedBudget = budgetRepository.save(budget);
        return BudgetDTO.builder()
                .id(savedBudget.getId())
                .projectName(savedBudget.getProjectName())
                .allocatedAmount(savedBudget.getAllocatedAmount())
                .spentAmount(savedBudget.getSpentAmount())
                .createdAt(savedBudget.getCreatedAt())
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
                .build();
    }
    public BudgetDTO getBudgetByStatus(String status) {
        Budget budget = (Budget) budgetRepository.findByStatus(status)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        return BudgetDTO.builder()
                .id(budget.getId())
                .projectName(budget.getProjectName())
                .allocatedAmount(budget.getAllocatedAmount())
                .spentAmount(budget.getSpentAmount())
                .createdAt(budget.getCreatedAt())
                .build();
    }

}
