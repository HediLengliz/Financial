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
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExpenseService implements IExpenseService{
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
                            .date(expense.getCreatedAt())
                            .budgetId(expense.getBudget() != null ? expense.getBudget().getId() : null)
                            .build())
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("Error fetching expenses: " + e.getMessage());
            throw new RuntimeException("Error fetching expenses", e);
        }
    }

    public ExpenseDTO createExpense(ExpenseDTO dto) {
        BudgetDTO budget = budgetService.getBudgetByProject(dto.getProject_id());
        //checking the remaining and expense amount
        System.out.println("Budget remaining: " + budget.getRemainingAmount());
        System.out.println("Expense amount: " + dto.getAmount());
        if (budget.getRemainingAmount().compareTo(dto.getAmount()) < 0) {
            throw new IllegalStateException("Expense exceeds remaining budget");
        }
        Expense expense = Expense.builder()
                .description(dto.getDescription())
                .amount(dto.getAmount())
                .createdAt(dto.getDate())
                .updatedAt(dto.getUpdatedAt())
                .status(dto.getStatus())
                .budget(Budget.builder().id(dto.getBudgetId()).build())
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        // Subtract the amount from the remaining budget
        BigDecimal newRemaining = budget.getRemainingAmount().subtract(dto.getAmount());
        //reassaign the remaining amount (converted amount and related attribs back to bigdeciaml for aithmtic calculs it can perform , . sperators)
        budget.setRemainingAmount(newRemaining);
        budgetService.updateBudget(dto.getProject_id(), budget);



        return ExpenseDTO.builder()
                .id(savedExpense.getId())
                .description(savedExpense.getDescription())
                .amount(savedExpense.getAmount())
                .updatedAt(savedExpense.getUpdatedAt())
                .status(savedExpense.getStatus())
                .date(savedExpense.getCreatedAt())
                .budgetId(savedExpense.getBudget().getId())
                .build();

    }
    public ExpenseDTO updateExpense(Long id, ExpenseDTO dto) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        Budget budget = budgetRepository.findById(dto.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCreatedAt(dto.getDate());
        expense.setBudget(budget);
        Expense savedExpense = expenseRepository.save(expense);
        return ExpenseDTO.builder()
                .id(savedExpense.getId())
                .description(savedExpense.getDescription())
                .amount(savedExpense.getAmount())
                .updatedAt(savedExpense.getUpdatedAt())
                .date(savedExpense.getCreatedAt())
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
                .date(expense.getCreatedAt())
                .budgetId(expense.getBudget().getId())
                .build();
    }
    //get expense by status
    public ExpenseDTO getExpenseByStatus(Status status) {
        Expense expense = expenseRepository.findByStatus(status)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        return ExpenseDTO.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .amount(expense.getAmount())
                .updatedAt(expense.getUpdatedAt())
                .status(expense.getStatus())
                .date(expense.getCreatedAt())
                .budgetId(expense.getBudget().getId())
                .build();
    }




}
