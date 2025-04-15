package com.tensai.projets.email;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class); // Manual logger definition

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;
    public EmailService(JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    @PostConstruct
    public void init() {
        log.info("JavaMailSender injected: {}", mailSender != null);
        log.info("SpringTemplateEngine injected: {}", templateEngine != null);
    }

    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        String templateName = (emailTemplate == null) ? "confirm-email" : emailTemplate.getName();
        sendEmailInternal(to, username, templateName, confirmationUrl, activationCode, subject, null, null, null);
    }

    @Async
    public void sendRoleAssignmentEmail(
            String to,
            String username,
            String projectName,
            String workflowName,
            String role,
            String confirmationUrl,
            String subject
    ) throws MessagingException {
        sendEmailInternal(to, username, EmailTemplateName.ASSIGN_ROLE.getName(), confirmationUrl, null, subject, projectName, workflowName, role);
    }

    private void sendEmailInternal(
            String to,
            String username,
            String templateName,
            String confirmationUrl,
            String activationCode,
            String subject,
            String projectName,
            String workflowName,
            String role
    ) throws MessagingException {
        if (mailSender == null) {
            throw new IllegalStateException("JavaMailSender is not initialized");
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );

        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        if (activationCode != null) {
            properties.put("activation_code", activationCode);
        }
        if (projectName != null) {
            properties.put("projectName", projectName);
        }
        if (workflowName != null) {
            properties.put("workflowName", workflowName);
        }
        if (role != null) {
            properties.put("role", role);
        }

        Context context = new Context();
        context.setVariables(properties);

        helper.setFrom("no-reply@tensai.com");
        helper.setTo(to);
        helper.setSubject(subject);

        String template = templateEngine.process(templateName, context);
        helper.setText(template, true);

        mailSender.send(mimeMessage);
        log.info("Email sent to {} with template {}", to, templateName);
    }
}