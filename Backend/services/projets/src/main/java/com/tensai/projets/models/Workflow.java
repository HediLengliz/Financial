package com.tensai.projets.models;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Setter
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String status;
    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    // Reference to the parent project
    @ManyToOne

    @JoinColumn(name = "user_id", nullable = true) // Foreign key to User
    private User user; // User assigned to this workflow (e.g., project manager or team member)

    private double progress;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20)
    private List<Task> tasks = new ArrayList<>(); // Tasks represent the steps in the workflow

    // Default constructor
    public Workflow() {
    }

    // Parameterized constructor
    public Workflow(String name, String description, String status, LocalDate createdAt, Project project, User user) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.createdAt = createdAt;
        this.project = project;
        this.user = user;
    }

    // Getters and Setters
    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public String getDescription() {
        return description;
    }

    public Project getProject() {
        return project;
    }

    public String getName() {
        return name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public Long getProjectId() {
        return project != null ? project.getId() : null; // Null-safe check
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}