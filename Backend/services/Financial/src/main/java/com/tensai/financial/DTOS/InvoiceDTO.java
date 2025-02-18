package com.tensai.financial.DTOS;

import com.tensai.financial.Entities.Status;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class InvoiceDTO {
    Long id;
    @NotBlank(message = "Invoice Number is required")
    @Min(value = 0, message = "Invoice Number must be greater than 0")
     String invoiceNumber;
    @NotBlank(message = "Total Amount is required")
    @Min(value = 0, message = "Total Amount must be greater than 0")
     Float totalAmount;
    @NotBlank(message = "Issue Date is required")
     LocalDate issueDate;
    @NotBlank(message = "Budget Id is required")
     Long budgetId; // To link with Budget
    @NotBlank(message = "Status is required")
    Status status;
    @NotBlank(message = "Tax is required")
    @Min(value = 0, message = "Tax must be greater than 0")
     Float tax;
    @NotBlank(message = "Due Date is required")
     LocalDate dueDate;
    @NotBlank(message = "Created at is required")
        LocalDate created_at;
    @NotBlank(message = "Issued by is required")
        String issued_by;
    @NotBlank(message = "Issued to is required")
        String issued_to;
    @NotBlank(message = "Amount is required")
    @Min(value = 0, message = "Amount must be greater than 0")
     Float amount;


}
