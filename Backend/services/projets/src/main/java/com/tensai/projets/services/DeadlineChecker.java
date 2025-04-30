package com.tensai.projets.services;

import com.tensai.projets.dtos.AlertEvent;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.TaskRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class DeadlineChecker {
    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;
    private final KafkaTemplate<String, AlertEvent> kafkaTemplate;

    public DeadlineChecker(ProjectRepository projectRepo,
                           TaskRepository taskRepo,
                           KafkaTemplate<String, AlertEvent> kafkaTemplate) {
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(cron = "0 0 8 * * *") // Daily at 8 AM
    public void checkDeadlines() {
        checkProjectDeadlines();
        checkTaskDeadlines();
    }

    private void checkProjectDeadlines() {
        LocalDate fiveDaysFromNow = LocalDate.now().plusDays(5);
        projectRepo.findByEndDateBetween(LocalDate.now(), fiveDaysFromNow)
                .forEach(project -> {
                    if (!"COMPLETED".equals(project.getStatus())) {
                        kafkaTemplate.send("project-alerts",
                                new AlertEvent(
                                        "PROJECT",
                                        "DEADLINE_SOON",
                                        project.getName(),
                                        project.getEndDate()
                                ));
                    }
                });
    }

    private void checkTaskDeadlines() {
        LocalDate fiveDaysFromNow = LocalDate.now().plusDays(5);
        taskRepo.findByDueDateBetween(LocalDate.now(), fiveDaysFromNow)
                .forEach(task -> {
                    if (!"COMPLETED".equals(task.getStatus())) {
                        kafkaTemplate.send("task-alerts",
                                new AlertEvent(
                                        "TASK",
                                        "DEADLINE_SOON",
                                        task.getTitle(),
                                        task.getDueDate()
                                ));
                    }
                });
    }
}