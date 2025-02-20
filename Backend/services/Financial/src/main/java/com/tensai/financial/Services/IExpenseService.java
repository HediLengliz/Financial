package com.tensai.financial.Services;

import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Status;

import java.util.List;

public interface IExpenseService {
    List<ExpenseDTO> getAllExpenses();
    ExpenseDTO createExpense(ExpenseDTO dto);
    ExpenseDTO updateExpense(Long id, ExpenseDTO dto);
    void deleteExpense(Long id);
    ExpenseDTO getExpenseById(Long id);
    ExpenseDTO getExpenseByStatus(Status status);
}
