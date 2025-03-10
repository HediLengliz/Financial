package com.tensai.financial.DTOS;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.BudgetStatus;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Entities.Transaction;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

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
public class BudgetDTO {

    Long id;
    @NotBlank(message = "Project Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    String projectName;
    @NotBlank(message = "Allocated Amount is required")
    @Min(value = 0, message = "Allocated Amount must be greater than 0")
    BigDecimal  allocatedAmount;
    @NotBlank(message = "Spent Amount is required")
    @Min(value = 0, message = "Spent Amount must be greater than 0")
    BigDecimal  spentAmount;
    @NotBlank(message = "Remaining Amount is required")
    @Min(value = 0, message = "Remaining Amount must be greater than 0")
    BigDecimal remainingAmount;
    @NotBlank(message = "Date is required")
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    LocalDate createdAt;
    @NotBlank(message = "Date is required")
//    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd")
    LocalDate updatedAt;
    @NotBlank(message = "Status is required")
    @NotNull
    Status status;
    @NotBlank(message = "Transaction is required")
    @NotNull
    Transaction transaction;
    @NotBlank(message = "Approval is required")
    @NotNull
    ApprovalStatus approval;
    @NotBlank(message = "Currency is required")
    String currency;
    @Column(
            name = "budget_status",
            nullable = false,
            columnDefinition = "varchar(255) default 'Sufficient' check (budget_status in ('Insufficient','Sufficient','Exceeded'))"
    )
    BudgetStatus budgetStatus;
    @Column(nullable = false, unique = true)
    UUID projectId;


}
