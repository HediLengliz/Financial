package com.tensai.financial.Services;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalHistory;
import com.tensai.financial.Repositories.ApprovalHistroyRepository;
import com.tensai.financial.Repositories.ApprovalRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ApprovalHistoryService implements IApprovalHistroyService {
    private final ApprovalHistroyRepository approvalHistoryRepository;
    private final ApprovalRepository approvalRepository;

    @Override
    public void logHistory(Long approvalId, String action, String performedBy) {
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
}

