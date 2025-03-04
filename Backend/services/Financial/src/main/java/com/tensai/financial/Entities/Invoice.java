package com.tensai.financial.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoice")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     String invoiceNumber;
 BigDecimal  amount;
 BigDecimal  totalAmount;
     String issued_by;
     String issued_to;
     LocalDate issueDate;
 BigDecimal tax;
     LocalDate dueDate;
     LocalDate created_at;
      UUID projectId;
      UUID supplierId;
     @Enumerated(EnumType.STRING)
     Status status;
     @ManyToOne
     @JoinColumn(name = "budget_id")
     Budget budget;
     @Enumerated(EnumType.STRING)
     ApprovalStatus approvalStatus;
    Integer installmentAmount;
}
