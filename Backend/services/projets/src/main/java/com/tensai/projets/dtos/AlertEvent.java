package com.tensai.projets.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class AlertEvent {
    private String entityType;
    private String alertType;
    private String entityName;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate relevantDate;

    public AlertEvent(String entityType, String alertType, String entityName, LocalDate relevantDate) {
        this.entityType = entityType;
        this.alertType = alertType;
        this.entityName = entityName;
        this.relevantDate = relevantDate;
    }
    public AlertEvent(){}

    // Getters
    public String getEntityType() { return entityType; }
    public String getAlertType() { return alertType; }
    public String getEntityName() { return entityName; }
    public LocalDate getRelevantDate() { return relevantDate; }
}
