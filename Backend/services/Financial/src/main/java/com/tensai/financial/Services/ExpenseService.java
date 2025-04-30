package com.tensai.financial.Services;

import com.tensai.financial.DTOS.BudgetDTO;
import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Expense;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Repositories.BudgetRepository;
import com.tensai.financial.Repositories.ExpenseRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExpenseService implements IExpenseService {
    private ExpenseRepository expenseRepository;
    private BudgetRepository budgetRepository;
    private final BudgetService budgetService;

    public List<ExpenseDTO> getAllExpenses() {
        try {
            return expenseRepository.findAll()
                    .stream()
                    .map(expense -> ExpenseDTO.builder()
                            .id(expense.getId())
                            .description(expense.getDescription())
                            .updatedAt(expense.getUpdatedAt())
                            .status(expense.getStatus())
                            .amount(expense.getAmount())
                            .createdAt(expense.getCreatedAt())
                            .category(expense.getCategory())
                            .budgetId(expense.getBudget() != null ? expense.getBudget().getId() : null)
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching expenses: " + e.getMessage());
            throw new RuntimeException("Error fetching expenses", e);
        }
    }

    public ExpenseDTO createExpense(ExpenseDTO dto) {
        // Retrieve the budget using the provided budgetId
        Budget budgetEntity = budgetRepository.findById(dto.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found with id: " + dto.getBudgetId()));

        // Log the remaining budget and expense amount for debugging
        System.out.println("Budget remaining: " + budgetEntity.getRemainingAmount());
        System.out.println("Expense amount: " + dto.getAmount());

        // Check if the expense exceeds the remaining budget
        if (budgetEntity.getRemainingAmount().compareTo(dto.getAmount()) < 0) {
            throw new IllegalStateException("Expense exceeds remaining budget");
        }

        // Create a new Expense entity from the DTO, auto-setting projectId from the budget
        Expense expense = Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .createdAt(dto.getCreatedAt())
                .updatedAt(dto.getUpdatedAt())
                .status(dto.getStatus())
                .budget(budgetEntity) // Link the full budget entity
                .projectId(budgetEntity.getProjectId()) // Automatically set from budget
                .category(dto.getCategory())
                .build();

        // Save the new expense to the repository
        Expense savedExpense = expenseRepository.save(expense);

        // Update the remaining budget
        BigDecimal newRemaining = budgetEntity.getRemainingAmount().subtract(dto.getAmount());
        budgetEntity.setRemainingAmount(newRemaining);
        budgetRepository.save(budgetEntity);

        // Return the ExpenseDTO with auto-affected project_id
        return ExpenseDTO.builder()
                .id(savedExpense.getId())
                .description(savedExpense.getDescription())
                .amount(savedExpense.getAmount())
                .updatedAt(savedExpense.getUpdatedAt())
                .status(savedExpense.getStatus())
                .createdAt(savedExpense.getCreatedAt())
                .budgetId(savedExpense.getBudget().getId())
                .project_id(savedExpense.getProjectId()) // Included in response
                .category(savedExpense.getCategory())
                .build();
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        Budget budget = budgetRepository.findById(dto.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCreatedAt(dto.getCreatedAt());
        expense.setBudget(budget);
        Expense savedExpense = expenseRepository.save(expense);
        return ExpenseDTO.builder()
                .id(savedExpense.getId())
                .description(savedExpense.getDescription())
                .amount(savedExpense.getAmount())
                .updatedAt(savedExpense.getUpdatedAt())
                .createdAt(savedExpense.getCreatedAt())
                .budgetId(savedExpense.getBudget().getId())
                .build();
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        return ExpenseDTO.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .updatedAt(expense.getUpdatedAt())
                .createdAt(expense.getCreatedAt())
                .budgetId(expense.getBudget().getId())
                .build();
    }

    @Override
    public List<ExpenseDTO> getExpenseByStatus(Status status) {
        List<Expense> expenses = expenseRepository.findByStatus(status);
        return expenses.stream()
                .map(expense -> ExpenseDTO.builder()
                        .id(expense.getId())
                        .description(expense.getDescription())
                        .amount(expense.getAmount())
                        .status(expense.getStatus())
                        .createdAt(expense.getCreatedAt())
                        .budgetId(expense.getBudget() != null ? expense.getBudget().getId() : null)
                        .build())
                .collect(Collectors.toList());
    }
    //get expense by status


    @Override
    public String categorizeExpense(String description, BigDecimal amount) {
        if (description.toLowerCase().contains("material")) return "Materials";
        if (description.toLowerCase().contains("transport")) return "Logistics";
        if (amount.compareTo(new BigDecimal("5000")) > 0) return "High-Value Purchase";
        return "Miscellaneous";

    }

    //Check for duplicate expenses
//    @Override
//    public boolean detectDuplicateExpense(UUID projectId, BigDecimal amount, LocalDate createdAt) {
//        return expenseRepository.existsByProjectIdAndSupplierIdAndAmountAndCreatedAt(projectId, amount, createdAt);
//    }


    @Override
    public List<ExpenseDTO> loadAllExpensesWithFilters(String description, BigDecimal amount, LocalDate createdAt, LocalDate updatedAt, String category, String status, UUID projectId) {
        try {
            List<Expense> filteredExpenses = expenseRepository.findAllByFilters(
                    description, amount, createdAt, updatedAt, category,
                    status != null ? Status.valueOf(status) : null, projectId);

            return filteredExpenses.stream()
                    .map(expense -> ExpenseDTO.builder()
                            .id(expense.getId())
                            .description(expense.getDescription())
                            .amount(expense.getAmount())
                            .createdAt(expense.getCreatedAt())
                            .updatedAt(expense.getUpdatedAt())
                            .status(expense.getStatus())
                            .category(expense.getCategory())
                            .budgetId(expense.getBudget() != null ? expense.getBudget().getId() : null)
                            .project_id(expense.getProjectId())
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching expenses with filters: " + e.getMessage(), e);
        }
    }




    private ExpenseDTO mapToDTO(Expense expense) {
        return ExpenseDTO.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .status(expense.getStatus())
                .createdAt(expense.getCreatedAt())
                .updatedAt(expense.getUpdatedAt())
                .category(expense.getCategory())
                .budgetId(expense.getBudget().getId())
                .build();
    }
}
