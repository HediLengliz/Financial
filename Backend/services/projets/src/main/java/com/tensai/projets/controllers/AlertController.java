package com.tensai.projets.controllers;

import com.tensai.projets.dtos.AlertEvent;
import com.tensai.projets.services.AlertEventListener;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertEventListener alertEventListener;

    public AlertController(AlertEventListener alertEventListener) {
        this.alertEventListener = alertEventListener;
    }

    // Fetch all recent alerts
    @GetMapping
    public List<AlertEvent> getAllAlerts() {
        return alertEventListener.getAllAlerts();
    }

    // Fetch alerts by entity type (e.g., PROJECT, TASK, WORKFLOW)
    @GetMapping("/by-type/{entityType}")
    public List<AlertEvent> getAlertsByType(@PathVariable String entityType) {
        return alertEventListener.getAlertsByType(entityType);
    }
}