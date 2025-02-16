package com.tensai.projets.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Project {

    // Getters and setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    // No-argument constructor (required by Hibernate)
    public Project() {
    }

    // Constructor with parameters
    public Project(String name, String description) {
        this.name = name;
        this.description = description;
    }

}