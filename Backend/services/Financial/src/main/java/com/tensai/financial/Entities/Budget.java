package com.tensai.financial.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "budget")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder


public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     String projectName;

    BigDecimal allocatedAmount;

    BigDecimal  spentAmount;

    BigDecimal  remainingAmount;

     LocalDate createdAt;
    String currency;

    LocalDate updatedAt;
    @Enumerated(EnumType.STRING)
    @NotNull
    Status status;
    @Enumerated(EnumType.STRING)
    @NotNull
    Transaction transaction;
    @Enumerated(EnumType.STRING)
    @NotNull
    Approval approval;
    @Enumerated(EnumType.STRING)
    @Column(
            name = "budget_status",
            nullable = false,
            columnDefinition = "varchar(255) default 'Sufficient' check (budget_status in ('Insufficient','Sufficient','Exceeded'))"
    )
    BudgetStatus budgetStatus;

    @Builder.Default
    UUID projectId = UUID.randomUUID();



}
