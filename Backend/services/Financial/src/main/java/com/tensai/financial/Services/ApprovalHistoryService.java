package com.tensai.financial.Services;

import com.tensai.financial.DTOS.ApprovalHistoryDTO;
import com.tensai.financial.DTOS.ExpenseDTO;
import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalHistory;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Repositories.ApprovalHistroyRepository;
import com.tensai.financial.Repositories.ApprovalRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ApprovalHistoryService implements IApprovalHistroyService {
    private final ApprovalHistroyRepository approvalHistoryRepository;
    private final ApprovalRepository approvalRepository;

    @Override
    public void logHistory(Long approvalId, String action ,String performedBy ) {
        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() -> new IllegalArgumentException("Approval not found"));

        ApprovalHistory history = ApprovalHistory.builder()
                .approval(approval)
                .action(action)
                .performedBy(performedBy)
                .timestamp(LocalDateTime.now())
                .build();
        approvalHistoryRepository.save(history);

    }

    @Override
    public List<ApprovalHistory> getHistoryByApprovalId(Long approvalId) {
        return approvalHistoryRepository.findByApprovalId(approvalId);
    }

    @Override
    public List<ApprovalHistoryDTO> getAllHistories() {
        List<ApprovalHistory> histories = approvalHistoryRepository.findAll();
        return histories.stream().map(history -> {
            ApprovalHistoryDTO dto = new ApprovalHistoryDTO();
            dto.setId(history.getId());
            dto.setPerformedBy(history.getPerformedBy());
            dto.setTimestamp(history.getTimestamp());
            dto.setAction(history.getAction());
            dto.setApprovalId(history.getApproval().getId());  // Extract approvalId from the Approval object
            dto.setApproval(history.getApproval());  // Still included, but ignored in JSON due to @JsonBackReference
            return dto;
        }).collect(Collectors.toList());
    }



    public void restoreApproval(Long approvalId, String performedBy) {
        // Find the approval
        Approval approval = approvalRepository.findById(approvalId)
                .orElseThrow(() -> new RuntimeException("Approval not found with ID: " + approvalId));

        // Check if it's deleted
        if (approval.getStatus() != ApprovalStatus.DELETED) {
            throw new IllegalStateException("Approval with ID " + approvalId + " is not deleted");
        }

        // Restore the approval by setting status to PENDING
        approval.setStatus(ApprovalStatus.PENDING);
        approval.setApprovedAt(LocalDate.from(LocalDateTime.now())); // Update timestamp
        approvalRepository.save(approval);

        // Log the restore action in history
        ApprovalHistory history = new ApprovalHistory();
        history.setApproval(approval);
        history.setAction("RESTORED");
        history.setPerformedBy(performedBy);
        history.setTimestamp(LocalDateTime.now());
        approvalHistoryRepository.save(history);
    }
}

