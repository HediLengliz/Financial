package com.tensai.financial.Entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

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

     Float allocatedAmount;

     Float spentAmount;

     LocalDate createdAt;

     LocalDate updatedAt;
    @Enumerated(EnumType.STRING)
    Status status;
    @Enumerated(EnumType.STRING)
    Transaction transaction;


}
