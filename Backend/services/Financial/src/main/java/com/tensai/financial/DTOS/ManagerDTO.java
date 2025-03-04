package com.tensai.financial.DTOS;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ManagerDTO {
    UUID id;
    String requestedBy;
    String approvedBy;

}
