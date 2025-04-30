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
    private String description;
    private String status;  // Change from Status enum to String
    private String priority;  // Change from Priority enum to String
    private LocalDate startDate;
    private LocalDate endDate;
    private String imagePath;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 20)
    private List<Workflow> workflows = new ArrayList<>();

    // Constructors, getters, and setters remain the same


// Constructors
    public Project() {}

    public Project(String name, String description, String status, String priority,
                   LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public void setId(Long id) { this.id = id; }

    public void setName(String name) { this.name = name; }

    public void setDescription(String description) { this.description = description; }

    public void setStatus(String status) { this.status = status; }

    public void setPriority(String priority) { this.priority = priority; }

    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

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


    public void setWorkflows(List<Workflow> workflows) { this.workflows = workflows; }

}
