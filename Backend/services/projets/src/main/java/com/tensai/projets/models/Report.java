package com.tensai.projets.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false) // Use TEXT for content
    private String content;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnore
    private User whoCreatedIt;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnore    private Project whichProjectIsLinkedTo;

    @Column(columnDefinition = "TEXT") // Use TEXT for pdf_public_id
    private String pdfPublicId;

    @Column(columnDefinition = "TEXT") // Use TEXT for pdf_url
    private String pdfUrl;

    @Column(columnDefinition = "TEXT", nullable = false) // Use TEXT for signature
    private String signature;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public Report() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Report(String content, User whoCreatedIt, Project whichProjectIsLinkedTo, String signature) {
        this.content = content;
        this.whoCreatedIt = whoCreatedIt;
        this.whichProjectIsLinkedTo = whichProjectIsLinkedTo;
        this.signature = signature;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public User getWhoCreatedIt() {
        return whoCreatedIt;
    }

    public void setWhoCreatedIt(User whoCreatedIt) {
        this.whoCreatedIt = whoCreatedIt;
    }

    public Project getWhichProjectIsLinkedTo() {
        return whichProjectIsLinkedTo;
    }

    public void setWhichProjectIsLinkedTo(Project whichProjectIsLinkedTo) {
        this.whichProjectIsLinkedTo = whichProjectIsLinkedTo;
    }

    public String getPdfPublicId() {
        return pdfPublicId;
    }

    public void setPdfPublicId(String pdfPublicId) {
        this.pdfPublicId = pdfPublicId;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}