package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.Status;
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
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExpenseDTO {
    Long id;
    @NotBlank(message = "Description is required")
    @Size(max = 350, message = "Description must be less than 100 characters")
     String description;
    @NotBlank(message = "Amount is required")
    @Min(value = 0, message = "Amount must be greater than 0")
    BigDecimal amount;
    @NotBlank(message = "Date is required")
     LocalDate createdAt;
    @NotBlank(message = "Update date is required")
    LocalDate updatedAt;
    @NotNull(message = "Budget ID is required") // Changed to @NotNull for Long
    Long budgetId; // To link with Budget
    @NotBlank(message = "Status is required")
     Status status;

    UUID project_id;
//    UUID supplier_id;
    @NotNull(message = "Category is required")
    String category;
}
