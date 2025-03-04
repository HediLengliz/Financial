package com.tensai.financial.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "approvals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Approval {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long Id;
    @Enumerated(EnumType.STRING)
    ApprovalStatus status;
    @ManyToOne
    @JoinColumn(name = "expense_id")
    Expense expense;
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    Invoice invoice;

    UUID requestedBy;
    UUID approvedBy;

    LocalDate requestedAt;
    LocalDate approvedAt;
    
}
