package com.tensai.financial.Entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvalHistory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApprovalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String action;
    @ManyToOne
    @JoinColumn(name = "approval_id", nullable = false)
    @JsonBackReference
    Approval approval;
    @NotBlank
    String performedBy;
    LocalDateTime timestamp;

}
