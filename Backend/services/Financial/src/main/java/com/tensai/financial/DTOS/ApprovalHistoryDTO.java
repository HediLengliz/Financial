package com.tensai.financial.DTOS;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tensai.financial.Entities.Approval;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ApprovalHistoryDTO {
    Long id;

    String performedBy;
    LocalDateTime timestamp;
    String action;
    @ManyToOne
    @JoinColumn(name = "approval_id", nullable = false)
    @JsonBackReference
    Approval approval;
    Long approvalId;  // Add this new field

}
