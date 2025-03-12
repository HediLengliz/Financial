package com.tensai.financial.Controllers;

import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Services.ApprovalService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
            @RequestParam (required = false) Long expenseId,
            @RequestParam (required = false)Long invoiceId,
            @RequestParam (required = false) UUID projectId,
            @RequestParam String managerId) {
        if (projectId == null) {
            projectId = UUID.randomUUID();
            log.info("Generated projectId: {}", projectId);
        }
        Approval approval = approvalService.requestApproval(expenseId, invoiceId, projectId, managerId);
        return ResponseEntity.ok(approval);
    }
    @PutMapping("/{id}/manager-approve")
    public ResponseEntity<?> approveByManager(@PathVariable Long id, @RequestParam String managerId) {
        try {
            approvalService.approveByManager(id, managerId);
            return ResponseEntity.ok().build();
        } catch (IllegalStateException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
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
    @PutMapping("/{id}/status")
    public ResponseEntity<Approval> updateStatus(@PathVariable Long id,@RequestParam ApprovalStatus approvalStatus) {
        Approval updatedApproval = approvalService.updateStatus(id, approvalStatus);
        return ResponseEntity.ok(updatedApproval);
    }


}
