package com.tensai.financial.Entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.*;

import java.time.LocalDate;
import java.util.List;
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
    @Column(nullable = false, unique = true)
    UUID projectId;
    String managerApprovalBy;
    String financeApprovalBy;
    LocalDate requestedAt;
    LocalDate approvedAt;
    @OneToMany(mappedBy = "approval", cascade = CascadeType.ALL, orphanRemoval = true)
    List<ApprovalHistory> approvalHistories;
}
