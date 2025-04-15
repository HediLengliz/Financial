package com.tensai.projets.services;

import com.tensai.projets.models.Project;
import com.tensai.projets.models.Report;
import com.tensai.projets.models.User;
import com.tensai.projets.repositories.ProjectRepository;
import com.tensai.projets.repositories.ReportRepository;
import com.tensai.projets.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private SpringTemplateEngine templateEngine;

    public Report createReport(Long projectId, String content, String signature) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with ID: " + projectId));

        User creator = project.getProjectManager();
        if (creator == null) {
            throw new RuntimeException("No project manager assigned to project ID: " + projectId);
        }

        Report report = new Report(content, creator, project, signature);

        byte[] pdfBytes = generateReportPdf(report);

        String fileName = "report_project_" + projectId + ".pdf";
        String publicId = fileStorageService.storeFile(pdfBytes, fileName);
        String pdfUrl = fileStorageService.getFileUrl(publicId);

        report.setPdfPublicId(publicId);
        report.setPdfUrl(pdfUrl);

        return reportRepository.save(report);
    }

    private byte[] generateReportPdf(Report report) {
        try {
            Context context = new Context();
            context.setVariable("report", report);
            context.setVariable("generatedDate", LocalDateTime.now().toString());

            String htmlContent = templateEngine.process("report-template", context);

            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            renderer.createPDF(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF for report: " + e.getMessage(), e);
        }
    }

    public List<Report> getReportsByProjectId(Long projectId) {
        return reportRepository.findByWhichProjectIsLinkedToId(projectId);
    }

    public Report getLatestReportByProjectId(Long projectId) {
        Report report = reportRepository.findTopByWhichProjectIsLinkedToIdOrderByCreatedAtDesc(projectId);
        if (report == null) {
            throw new RuntimeException("No report found for project ID: " + projectId);
        }
        return report;
    }

    public List<Report> getReportsByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return reportRepository.findByWhoCreatedIt(user);
    }

    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + reportId));

        if (report.getPdfPublicId() != null) {
            fileStorageService.deleteFile(report.getPdfPublicId());
        }

        reportRepository.delete(report);
    }

    @Transactional(readOnly = true)
    public Report getReportEntity(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + id));
    }
}