package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.Status;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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
     Float amount;
    @NotBlank(message = "Date is required")
     LocalDate date;
    @NotBlank(message = "Update date is required")
    LocalDate updatedAt;
    @NotBlank(message = "Budget Id is required")
     Long budgetId; // To link with Budget
    @NotBlank(message = "Status is required")
     Status status;
}
