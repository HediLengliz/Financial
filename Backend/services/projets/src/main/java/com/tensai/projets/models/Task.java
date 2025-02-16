package com.tensai.projets.models;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Getter
@Setter
//@NoArgsConstructor//(access = AccessLevel.PROTECTED)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    public Task(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public Task() {

    }

    public void updateProgress(TaskStatus status) {
        this.status = status;
    }

    // Internal method (domain logic)
    void setProject(Project project) {
        this.project = project;
    }



enum TaskStatus {
    PENDING, IN_PROGRESS, COMPLETED
}
}
