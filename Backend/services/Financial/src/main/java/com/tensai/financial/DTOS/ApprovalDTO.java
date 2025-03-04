package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.ApprovalStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApprovalDTO {

    ApprovalStatus status;
    @NotBlank(message = "Expense ID is required")
    Long expenseId;
    @NotBlank(message = "Invoice ID is required")
    Long invoiceId;
    @NotBlank(message = "Requested By is required")
    @Size(max = 100, message = "Requested By must be less than 100 characters")
    String requestedBy;
    @NotBlank(message = "Approved By is required")
    @Size(max = 100, message = "Approved By must be less than 100 characters")
    String approvedBy;
    @NotBlank(message = "Requested At is required")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    String requestedAt;
    @NotBlank(message = "Approved At is required")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    String approvedAt;
    ManagerDTO managerId;

}
