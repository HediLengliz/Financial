package com.tensai.financial.Services;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalStatus;

import java.util.List;
import java.util.UUID;

public interface IApprovalService {
    Approval requestApproval(Long expenseId, Long invoiceId, UUID projectId, String managerId);
    void approveByManager(Long approvalId, String managerId);
    Approval approveByFinance(Long approvalId, String financeTeamId);
    boolean isFullyApproved(Long approvalId);
    Approval getApprovalById(Long approvalId);
    List<Approval> getAllApprovals();
    Approval updateStatus(Long id, ApprovalStatus approvalStatus);
    public void softDelete(Long id, String performedBy);
    void restoreApproval(Long id, String performedBy);
}
