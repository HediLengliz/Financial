package com.tensai.projets.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Builder
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(columnDefinition = "TEXT")
    private String description;    private String status;  // Change from Status enum to String
    private String priority;  // Change from Priority enum to String
    private LocalDate startDate;
    private LocalDate endDate;
    private String imagePath;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20)
    private List<Workflow> workflows = new ArrayList<>();

    private double progress; // Add this field

    @ManyToOne
    @JoinColumn(name = "project_manager_id", nullable = false) // Foreign key to User
    private User projectManager; // Reference to the project manager
    @ManyToOne
    @JoinColumn(name = "project_owner_id", nullable = false)
    private User projectOwner;

    // Constructors
    public Project() {
    }

    public Project(String name, String description, String status, String priority,
                   LocalDate startDate, LocalDate endDate, User projectManager) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.startDate = startDate;
        this.endDate = endDate;
        this.projectManager = projectManager;
    }

    public User getProjectOwner() {
        return projectOwner;
    }

    public void setProjectOwner(User projectOwner) {
        this.projectOwner = projectOwner;
    }
    public Long getProjectManagerId() {
        return projectManager != null ? projectManager.getId() : null;
    }
    public Long getProjectOwnerId() {
        return projectManager != null ? projectManager.getId() : null;
    }

    // Getters and Setters
    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getImagePath() {
        return imagePath;
    }

    public List<Workflow> getWorkflows() {
        return workflows;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setWorkflows(List<Workflow> workflows) {
        this.workflows = workflows;
    }

    public User getProjectManager() {
        return projectManager;
    }

    public void setProjectManager(User projectManager) {
        this.projectManager = projectManager;
    }
}