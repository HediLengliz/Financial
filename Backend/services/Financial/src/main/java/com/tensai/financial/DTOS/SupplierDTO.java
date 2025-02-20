package com.tensai.financial.DTOS;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupplierDTO {
     UUID id;
     @NotBlank(message = "Company Name is required")
     @Size(max = 100, message = "Company Name must be less than 100 characters")
     String companyName;
     @Email(message = "Email should be valid")
     @NotBlank(message = "Email is required")
     String contactEmail;
}
