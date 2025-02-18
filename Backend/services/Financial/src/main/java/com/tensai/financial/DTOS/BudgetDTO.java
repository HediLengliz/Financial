package com.tensai.financial.DTOS;
import jakarta.validation.constraints.*;

import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDate;

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
    Float allocatedAmount;
    @NotBlank(message = "Spent Amount is required")
    @Min(value = 0, message = "Spent Amount must be greater than 0")
    Float spentAmount;
    @NotBlank(message = "Date is required")
    LocalDate createdAt;
}
