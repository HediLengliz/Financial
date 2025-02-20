package com.tensai.financial.Entities;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "expense")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;

     String description;

    BigDecimal amount;


    LocalDate createdAt;

    LocalDate updatedAt;
    String category;

    @ManyToOne
    @JoinColumn(name = "budget_id")
     Budget budget;
    @Enumerated(EnumType.STRING)
    Status status;

}
