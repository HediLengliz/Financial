package com.tensai.financial.Services;

import com.tensai.financial.Entities.Approval;

import java.util.List;
import java.util.UUID;

public interface IApprovalService {
    Approval requestApproval(Long expenseId, Long invoiceId, UUID projectId, String managerId);
    Approval approveByManager(Long approvalId, String managerId);
    Approval approveByFinance(Long approvalId, String financeTeamId);
    boolean isFullyApproved(Long approvalId);
    Approval getApprovalById(Long approvalId);
    List<Approval> getAllApprovals();
}
