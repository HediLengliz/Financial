package com.tensai.projets.services;

import com.tensai.projets.dtos.AlertEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AlertEventListener {

    private final List<AlertEvent> alerts = new ArrayList<>();

    @KafkaListener(topics = "workflow-alerts", groupId = "${spring.kafka.consumer.group-id}")
    public void listenWorkflowAlerts(AlertEvent alertEvent) {
        System.out.println("Received Workflow Alert: " + alertEvent);
        handleAlert(alertEvent, "WORKFLOW");
        alerts.add(alertEvent); // Store the alert
    }

    @KafkaListener(topics = "task-alerts", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTaskAlerts(AlertEvent alertEvent) {
        System.out.println("Received Task Alert: " + alertEvent);
        handleAlert(alertEvent, "TASK");
        alerts.add(alertEvent); // Store the alert
    }

    @KafkaListener(topics = "project-alerts", groupId = "${spring.kafka.consumer.group-id}")
    public void listenProjectAlerts(AlertEvent alertEvent) {
        System.out.println("Received Project Alert: " + alertEvent);
        handleAlert(alertEvent, "PROJECT");
        alerts.add(alertEvent); // Store the alert
    }

    private void handleAlert(AlertEvent alertEvent, String entityType) {
        switch (alertEvent.getAlertType()) {
            case "COMPLETED":
                handleCompletionAlert(alertEvent, entityType);
                break;
            case "HIGH_PRIORITY":
                handleHighPriorityAlert(alertEvent, entityType);
                break;
            case "DEADLINE_SOON":
                handleDeadlineSoonAlert(alertEvent, entityType);
                break;
            default:
                System.out.println("Unknown alert type: " + alertEvent.getAlertType());
        }
    }

    private void handleCompletionAlert(AlertEvent alertEvent, String entityType) {
        System.out.println(entityType + " completed: " + alertEvent.getEntityName());
    }

    private void handleHighPriorityAlert(AlertEvent alertEvent, String entityType) {
        System.out.println(entityType + " high priority: " + alertEvent.getEntityName());
    }

    private void handleDeadlineSoonAlert(AlertEvent alertEvent, String entityType) {
        if (alertEvent.getRelevantDate() != null) {
            System.out.println(entityType + " deadline soon: " + alertEvent.getEntityName()
                    + " (Due Date: " + alertEvent.getRelevantDate() + ")");
        } else {
            System.out.println(entityType + " deadline soon: " + alertEvent.getEntityName());
        }
    }

    // Expose the stored alerts
    public List<AlertEvent> getAllAlerts() {
        return alerts;
    }

    public List<AlertEvent> getAlertsByType(String entityType) {
        return alerts.stream()
                .filter(alert -> alert.getEntityType().equalsIgnoreCase(entityType))
                .toList();
    }
}