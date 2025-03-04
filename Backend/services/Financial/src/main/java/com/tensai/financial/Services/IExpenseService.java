package com.tensai.financial.Services;

import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IExpenseService {
    List<ExpenseDTO> getAllExpenses();
    ExpenseDTO createExpense(ExpenseDTO dto);
    ExpenseDTO updateExpense(Long id, ExpenseDTO dto);
    void deleteExpense(Long id);
    ExpenseDTO getExpenseById(Long id);
    ExpenseDTO getExpenseByStatus(Status status);
    public String categorizeExpense(String description, BigDecimal amount);
    public boolean detectDuplicateExpense(UUID projectId, UUID supplierId, BigDecimal amount, LocalDate createdAt);
    public BigDecimal forecastProjectBudget(UUID projectId);
}
