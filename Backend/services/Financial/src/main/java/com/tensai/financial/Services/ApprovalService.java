package com.tensai.financial.Services;
import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Repositories.ApprovalRepository;

import com.tensai.financial.Repositories.ExpenseRepository;
import com.tensai.financial.Repositories.InvoiceRepository;
import jakarta.persistence.EntityNotFoundException;
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
    public void approveByManager(Long approvalId, String managerId) {
        // Check if approval exists
        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() -> new RuntimeException("Approval not found with ID: " + approvalId));

        // Validate managerId
        if (managerId == null || managerId.trim().isEmpty() || managerId.equals("undefined")) {
            throw new IllegalArgumentException("Manager ID is required and must be valid");
        }

        // Check if the manager is authorized
        if (!approval.getManagerApprovalBy().equals(managerId)) {
            throw new IllegalStateException("Only the assigned manager can approve");
        }

        // Update approval status
        approval.setStatus(ApprovalStatus.APPROVED);
        approvalRepository.save(approval);
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
    public Approval updateStatus(Long id, ApprovalStatus approvalStatus) {
        Approval approval = approvalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Approval not found with ID: " + id));
        approval.setStatus(ApprovalStatus.valueOf(String.valueOf(approvalStatus))); // Assuming ApprovalStatus is an enum
        return approvalRepository.save(approval);
    }
    @Override
    @Transactional
    public void softDelete(Long id, String performedBy) {
        Approval approval = getApprovalById(id);
        if (approval.getStatus() != ApprovalStatus.DELETED) {
            approval.setStatus(ApprovalStatus.DELETED);
            try {
                approvalRepository.save(approval);
                approvalHistoryService.logHistory(id, "soft-deleted", performedBy);
            } catch (Exception e) {
                throw new IllegalStateException("Failed to soft delete approval due to database constraint: " + e.getMessage());
            }
        } else {
            throw new IllegalStateException("Approval is already deleted");
        }
    }

    @Override
    @Transactional
    public void restoreApproval(Long id, String performedBy) {
        Approval approval = getApprovalById(id);
        if (approval.getStatus() == ApprovalStatus.DELETED) {
            approval.setStatus(ApprovalStatus.PENDING); // Restore to PENDING state
            approvalRepository.save(approval);
            approvalHistoryService.logHistory(id, "restored", performedBy);
        } else {
            throw new IllegalStateException("Approval is not deleted");
        }
    }

}

