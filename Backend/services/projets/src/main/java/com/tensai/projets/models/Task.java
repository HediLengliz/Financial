package com.tensai.projets.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Task {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;



    private LocalDate dueDate;


    private String priority ;

    private Double estimatedHours;
    private Double loggedHours = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id")
    private Workflow workflow;

    private Long assigneeId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private boolean deleted = false;

    private int orderInWorkflow; // Defines the sequence of the task within the workflow
    public String status ;

    public String getDescription() {
        return description;
    }

    public Long getId() {
        return id;
    }

    public Double getLoggedHours() {
        return loggedHours;
    }

    public String getTitle() {
        return title;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public String getPriority() {
        return priority;
    }

    public Workflow getWorkflow() {
        return workflow;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getStatus() {
        return status;
    }

    public int getOrderInWorkflow() {
        return orderInWorkflow;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setLoggedHours(Double loggedHours) {
        this.loggedHours = loggedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status != null ? status.toUpperCase() : null;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public void setOrderInWorkflow(Integer orderInWorkflow) {
        this.orderInWorkflow = orderInWorkflow;
    }

    public void setWorkflow(Workflow workflow) {
        this.workflow = workflow;
    }
}
