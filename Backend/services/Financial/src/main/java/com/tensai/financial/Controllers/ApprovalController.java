package com.tensai.financial.Controllers;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Services.ApprovalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/financial/approvals")
@RequiredArgsConstructor
@Tag(name = "Approval Management", description = "managing approvals")
public class ApprovalController {
    private static final Logger log = LoggerFactory.getLogger(ApprovalController.class);

    private final ApprovalService approvalService;
    @PostMapping("/request")
    public ResponseEntity<Approval> requestApproval(
            @RequestParam Long expenseId,
            @RequestParam Long invoiceId,
            @RequestParam UUID projectId,
            @RequestParam String managerId) {
        if (projectId == null) {
            projectId = UUID.randomUUID();
            log.info("Generated projectId: {}", projectId);
        }
        Approval approval = approvalService.requestApproval(expenseId, invoiceId, projectId, managerId);
        return ResponseEntity.ok(approval);
    }
    @PutMapping("/{approvalId}/manager-approve")
    public ResponseEntity<Approval> approveByManager(
            @PathVariable Long approvalId,
            @RequestParam String managerId) {
        Approval approval = approvalService.approveByManager(approvalId, managerId);
        return ResponseEntity.ok(approval);
    }
    @PutMapping("/{approvalId}/finance-approve")
    public ResponseEntity<Approval> approveByFinance(
            @PathVariable Long approvalId,
            @RequestParam String financeTeamId) {
        Approval approval = approvalService.approveByFinance(approvalId, financeTeamId);
        return ResponseEntity.ok(approval);
    }
    @GetMapping("/{approvalId}/status")
    public ResponseEntity<Boolean> isFullyApproved(@PathVariable Long approvalId) {
        boolean isApproved = approvalService.isFullyApproved(approvalId);
        return ResponseEntity.ok(isApproved);
    }
    @GetMapping("/{approvalId}")
    public ResponseEntity<Approval> getApprovalById(@PathVariable Long approvalId) {
        Approval approval = approvalService.getApprovalById(approvalId);
        return ResponseEntity.ok(approval);
    }
    @GetMapping
    public ResponseEntity<List<Approval>> getAllApprovals() {
        List<Approval> approvals = approvalService.getAllApprovals();
        return ResponseEntity.ok(approvals);
    }

}
