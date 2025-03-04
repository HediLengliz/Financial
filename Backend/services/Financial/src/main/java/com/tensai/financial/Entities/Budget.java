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

    @Column(nullable = false, length = 100)
    String projectName;

    @Column(nullable = false)
    BigDecimal   allocatedAmount;

    @Column(nullable = false)
    BigDecimal   spentAmount;

    @Column(nullable = false)
    BigDecimal   remainingAmount;

    @Column(nullable = false)
    LocalDate createdAt;

    @Column(nullable = false)
    LocalDate updatedAt;

    @Enumerated(EnumType.STRING)
    Status status;

    @Enumerated(EnumType.STRING)
    Transaction transaction;

    @Enumerated(EnumType.STRING)
    ApprovalStatus approval;

    @Column(nullable = false)
    String currency;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_status", nullable = false)
    BudgetStatus budgetStatus;

    @Column(nullable = false, unique = true)
    private UUID projectId;


}
