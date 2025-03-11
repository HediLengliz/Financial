package com.tensai.financial.Services;
import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Repositories.ApprovalRepository;

import com.tensai.financial.Repositories.ExpenseRepository;
import com.tensai.financial.Repositories.InvoiceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class ApprovalService implements  IApprovalService {
    private final ApprovalRepository approvalRepository;
    private final ApprovalHistoryService approvalHistoryService;
    private final ExpenseRepository expenseRepository; // For validation
    private final InvoiceRepository invoiceRepository; // For validation


    @Override
    @Transactional
    public Approval requestApproval(Long expenseId, Long invoiceId, UUID projectId, String managerId) {
        if (expenseId == null && invoiceId == null) {
            throw new IllegalArgumentException("Either expenseId or invoiceId must be provided");
        }

        Approval approval = Approval.builder()
                .status(ApprovalStatus.PENDING) // Initial status
                .expense(expenseId != null ? expenseRepository.findById(expenseId).orElse(null) : null)
                .invoice(invoiceId != null ? invoiceRepository.findById(invoiceId).orElse(null) : null)
                .projectId(projectId)
                .managerApprovalBy(managerId) // Assigned manager
                .requestedAt(LocalDate.now())
                .build();

        approval = approvalRepository.save(approval);
        approvalHistoryService.logHistory(approval.getId(), "Created", managerId);
        return approval;
    }

    @Override
    @Transactional
    public Approval approveByManager(Long approvalId, String managerId) {
        Approval approval = getApprovalById(approvalId);

        if (approval.getStatus() != ApprovalStatus.PENDING) {
            throw new IllegalStateException("Approval is not pending manager review");
        }
        if (!managerId.equals(approval.getManagerApprovalBy())) {
            throw new IllegalStateException("Only the assigned manager can approve");
        }

        approval.setStatus(ApprovalStatus.PENDING); // Still pending until finance approves
        approval.setManagerApprovalBy(managerId);
        approval.setApprovedAt(LocalDate.now());
        approval = approvalRepository.save(approval);
        approvalHistoryService.logHistory(approvalId, "Manager Approved", managerId);
        return approval;
    }

    @Override
    @Transactional
    public Approval approveByFinance(Long approvalId, String financeTeamId) {
        Approval approval = getApprovalById(approvalId);

        if (approval.getManagerApprovalBy() == null) {
            throw new IllegalStateException("Manager approval required first");
        }

        approval.setStatus(ApprovalStatus.APPROVED);
        approval.setFinanceApprovalBy(financeTeamId);
        approval.setApprovedAt(LocalDate.now());
        approval = approvalRepository.save(approval);
        approvalHistoryService.logHistory(approvalId, "Finance Approved", financeTeamId);
        return approval;
    }

    @Override
    public boolean isFullyApproved(Long approvalId) {
        Approval approval = getApprovalById(approvalId);
        return approval.getStatus() == ApprovalStatus.APPROVED;
    }

    @Override
    public Approval getApprovalById(Long approvalId) {
        return approvalRepository.findById(approvalId)
                .orElseThrow(() -> new IllegalArgumentException("Approval not found with ID: " + approvalId));
    }

    @Override
    public List<Approval> getAllApprovals() {
        return approvalRepository.findAll();

    }
}

