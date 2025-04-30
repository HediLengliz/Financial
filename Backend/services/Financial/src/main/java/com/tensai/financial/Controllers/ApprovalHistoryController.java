package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.ApprovalHistoryDTO;
import com.tensai.financial.Entities.Approval;
import com.tensai.financial.Entities.ApprovalHistory;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Repositories.ApprovalRepository;
import com.tensai.financial.Services.ApprovalHistoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/financial/approval-history")
@RequiredArgsConstructor
@Tag(name = "Approval History Management", description = "managing approvals histories")
public class ApprovalHistoryController {
    private final ApprovalHistoryService approvalHistoryService;
    private final ApprovalRepository approvalRepository;
    @GetMapping("/histories")
    public List<ApprovalHistoryDTO> getAllHistories() {
        return approvalHistoryService.getAllHistories();
    }

    // 1b. Display history for a specific approval
    @GetMapping("/{approvalId}/histories")
    public List<ApprovalHistory> getHistoriesByApprovalId(@PathVariable Long approvalId) {
        return approvalHistoryService.getHistoryByApprovalId(approvalId);
    }

    // Restore a deleted approval
    @PostMapping("/{approvalId}/restore")
    public void restoreApproval(@PathVariable Long approvalId, @RequestParam String performedBy) {
        approvalHistoryService.restoreApproval(approvalId, performedBy);
    }

    // Export approvals to CSV
    @GetMapping("/export")
    public void exportApprovalsToCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"approvals.csv\"");

        List<Approval> approvals = approvalRepository.findAll();
        try (PrintWriter writer = response.getWriter()) {
            // Updated header to match the fields being exported
            writer.println("id,status,managerApprovalBy,expense,invoice,createdAt,updatedAt");
            for (Approval approval : approvals) {
                writer.println(
                        approval.getId() + "," +
                                approval.getStatus() + "," +
                                approval.getManagerApprovalBy() + "," +
                                approval.getExpense() + "," +
                                approval.getInvoice() + "," +
                                approval.getApprovedAt() + "," +
                                approval.getApprovedAt().toString() + ","
                );
            }
        }
    }

    // Import approvals from CSV
    @PostMapping("/import")
    public void importApprovalsFromCSV(@RequestParam("file") MultipartFile file) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false; // Skip header row
                    continue;
                }
                String[] data = line.split(",");
                if (data.length >= 7) { // Expecting all fields from export
                    try {
                        Approval approval = new Approval();
                        approval.setStatus(ApprovalStatus.valueOf(data[1])); // status
                        approval.setManagerApprovalBy(data[2]);
                        approval.setApprovedAt(LocalDate.from(LocalDateTime.parse(data[3])));
                        approval.setFinanceApprovalBy(String.valueOf(LocalDateTime.parse(data[4])));
                        approvalRepository.save(approval);
                    } catch (IllegalArgumentException e) {
                        System.err.println("Invalid status: " + data[1]);
                    } catch (Exception e) {
                        System.err.println("Error parsing line: " + line);
                    }
                }
            }
        }
    }
}
