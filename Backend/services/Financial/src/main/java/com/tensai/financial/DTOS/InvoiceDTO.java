package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Status;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InvoiceDTO {
    Long id;
    String invoiceNumber;
    BigDecimal  amount;
    BigDecimal  totalAmount;
    String issued_by;
    String issued_to;
    LocalDate issueDate;
    BigDecimal tax;
    LocalDate dueDate;
    LocalDate created_at;
    UUID projectId;
    @Enumerated(EnumType.STRING)
    Status status;
    @ManyToOne
    @JoinColumn(name = "budget_id")
    @NotNull(message = "Budget ID is required") // Changed to @NotNull for Long
    Long budgetId; // To link with Budget
    @Enumerated(EnumType.STRING)
    ApprovalStatus approvalStatus;



}
