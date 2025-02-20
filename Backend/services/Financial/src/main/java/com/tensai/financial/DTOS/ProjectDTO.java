package com.tensai.financial.DTOS;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.UUID;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProjectDTO {
     UUID id;
     @NotBlank(message = "Project Name is required")
     @Size(max = 100, message = "Name must be less than 100 characters")
     String projectName;
     @NotBlank(message = "Allocated Budget is required")
     @Max(value = 0, message = "Allocated Budget must be greater than 0")
     BigDecimal allocatedBudget;

}
