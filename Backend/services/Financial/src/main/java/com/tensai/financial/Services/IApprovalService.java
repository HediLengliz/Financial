package com.tensai.financial.Services;

import com.tensai.financial.Entities.Approval;

import java.util.List;
import java.util.UUID;

public interface IApprovalService {
    public void requestExpenseApproval(Long expenseId, Long invoiceId);
    public void approveExpense(Long Id,UUID ManagerId);
    public List<Approval> getAllApprovals();
}
