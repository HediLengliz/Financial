package com.tensai.projets.controllers;

import com.tensai.projets.dtos.ReportRequest;
import com.tensai.projets.models.Report;
import com.tensai.projets.models.Project;
import com.tensai.projets.models.User;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.UserRepository;
import com.tensai.projets.services.ReportService;
import com.tensai.projets.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService; // Added to resolve user from JWT

    @PostMapping("/project/{projectId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Report> createReport(
            @PathVariable Long projectId,
            @RequestBody ReportRequest reportRequest,
            @AuthenticationPrincipal Jwt jwt) {
        validateProjectAccess(projectId, jwt);
        Report report = reportService.createReport(
                projectId,
                reportRequest.getContent(),
                reportRequest.getSignature()
        );
        return ResponseEntity.ok(report);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<List<Report>> getReportsByProjectId(
            @PathVariable Long projectId,
            @AuthenticationPrincipal Jwt jwt) {
        validateProjectAccess(projectId, jwt);
        List<Report> reports = reportService.getReportsByProjectId(projectId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/project/{projectId}/latest")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Report> getLatestReportByProjectId(
            @PathVariable Long projectId,
            @AuthenticationPrincipal Jwt jwt) {
        validateProjectAccess(projectId, jwt);
        Report report = reportService.getLatestReportByProjectId(projectId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<List<Report>> getReportsByUserId(
            @PathVariable Long userId,
            @AuthenticationPrincipal Jwt jwt) {
        validateUserReportsAccess(userId, jwt);
        List<Report> reports = reportService.getReportsByUserId(userId);
        return ResponseEntity.ok(reports);
    }

    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasRole('PROJECT_MANAGER')")
    public ResponseEntity<Void> deleteReport(
            @PathVariable Long reportId,
            @AuthenticationPrincipal Jwt jwt) {
        validateReportAccess(reportId, jwt);
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }

    private void validateProjectAccess(Long projectId, Jwt jwt) {
        Long userId = extractUserId(jwt);
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (projectOpt.isEmpty()) {
            throw new RuntimeException("Project not found with ID: " + projectId);
        }
        Project project = projectOpt.get();
        User projectManager = project.getProjectManager();
        if (projectManager == null || !projectManager.getId().equals(userId)) {
            throw new RuntimeException("User not authorized to access project: " + projectId);
        }
    }

    private void validateUserReportsAccess(Long userId, Jwt jwt) {
        Long authenticatedUserId = extractUserId(jwt);
        List<Project> managedProjects = projectRepository.findByProjectManagerId(authenticatedUserId);
        if (managedProjects.isEmpty()) {
            throw new RuntimeException("User not authorized: no managed projects found");
        }
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        User user = userOpt.get();
        List<Report> userReports = reportService.getReportsByUserId(userId);
        boolean hasAccess = userReports.stream()
                .anyMatch(report -> {
                    Project linkedProject = report.getWhichProjectIsLinkedTo();
                    return linkedProject != null && managedProjects.stream()
                            .anyMatch(project -> project.getId().equals(linkedProject.getId()));
                });
        if (!hasAccess) {
            throw new RuntimeException("User not authorized to access reports for user: " + userId);
        }
    }

    private void validateReportAccess(Long reportId, Jwt jwt) {
        Long userId = extractUserId(jwt);
        Optional<Report> reportOpt = Optional.ofNullable(reportService.getReportEntity(reportId));
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found with ID: " + reportId);
        }
        Report report = reportOpt.get();
        Project project = report.getWhichProjectIsLinkedTo();
        if (project == null) {
            throw new RuntimeException("No project linked to report: " + reportId);
        }
        User projectManager = project.getProjectManager();
        if (projectManager == null || !projectManager.getId().equals(userId)) {
            throw new RuntimeException("User not authorized to access report: " + reportId);
        }
    }

    private Long extractUserId(Jwt jwt) {
        User user = userService.syncUserFromJwt(jwt); // Use UserService to resolve user
        if (user == null || user.getId() == null) {
            throw new RuntimeException("Unable to resolve user ID from JWT token");
        }
        return user.getId();
    }
}