package com.tensai.financial.DTOS;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private String id;
    private String message;
    private String type;
    private String recipientEmail;
    private LocalDateTime timestamp;
    private String actionUrl;
    private String entityId;
    private String entityType;
    private boolean read;
    private String status;
} 