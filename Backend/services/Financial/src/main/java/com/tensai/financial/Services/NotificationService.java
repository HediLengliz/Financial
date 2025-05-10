package com.tensai.financial.Services;

import com.tensai.financial.Config.KafkaConfig;
import com.tensai.financial.DTOS.NotificationDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final KafkaTemplate<String, NotificationDTO> kafkaTemplate;
    
    @Value("${spring.kafka.bootstrap-servers:localhost:9092}")
    private String bootstrapServers;
    
    /**
     * Send a notification to Kafka
     */
    public void sendNotification(String message, String type, String recipientEmail, 
                                 String entityId, String entityType) {
        NotificationDTO notification = NotificationDTO.builder()
                .id(UUID.randomUUID().toString())
                .message(message)
                .type(type)
                .recipientEmail(recipientEmail)
                .timestamp(LocalDateTime.now())
                .entityId(entityId)
                .entityType(entityType)
                .read(false)
                .status("SENT")
                .build();
        
        try {
            log.info("Attempting to send notification: {}", notification);
            CompletableFuture<SendResult<String, NotificationDTO>> future = 
                kafkaTemplate.send(KafkaConfig.NOTIFICATION_TOPIC, notification.getId(), notification);
            
            future.whenComplete((result, ex) -> {
                if (ex == null) {
                    log.info("Notification sent successfully: {}", notification.getId());
                } else {
                    log.error("Failed to send notification: {}", ex.getMessage());
                    // Handle the failed message - could save to DB or retry later
                    handleFailedNotification(notification, ex);
                }
            });
        } catch (Exception e) {
            log.error("Error sending notification to Kafka: {}", e.getMessage());
            // Fall back to alternative notification mechanism
            handleFailedNotification(notification, e);
        }
    }
    
    private void handleFailedNotification(NotificationDTO notification, Throwable ex) {
        // Here you would implement your fallback strategy
        // For example, save to database, send via email, etc.
        log.info("Fallback notification handling for: {}", notification.getId());
        // For now, we'll just log it
    }
    
    /**
     * Listen for notifications from Kafka
     */
    @KafkaListener(
        topics = KafkaConfig.NOTIFICATION_TOPIC, 
        groupId = "${spring.kafka.consumer.group-id}",
        autoStartup = "${kafka.listener.auto-startup:true}",
        containerFactory = "notificationKafkaListenerContainerFactory"
    )
    public void consumeNotification(NotificationDTO notification) {
        try {
            log.info("Received notification: {}", notification);
            // Here you can:
            // 1. Save to database
            // 2. Send email/push notification
            // 3. Trigger other events
            processNotification(notification);
        } catch (Exception e) {
            log.error("Error processing notification: {}", e.getMessage());
        }
    }
    
    /**
     * Process the received notification
     */
    private void processNotification(NotificationDTO notification) {
        log.info("Processing notification: {}", notification);
        
        // You could add different processing based on notification type
        switch (notification.getType()) {
            case "PAYMENT" -> handlePaymentNotification(notification);
            case "BUDGET" -> handleBudgetNotification(notification);
            case "INVOICE" -> handleInvoiceNotification(notification);
            default -> handleDefaultNotification(notification);
        }
    }
    
    private void handlePaymentNotification(NotificationDTO notification) {
        log.info("Handling payment notification: {}", notification.getId());
        // Process payment-specific notification logic
    }
    
    private void handleBudgetNotification(NotificationDTO notification) {
        log.info("Handling budget notification: {}", notification.getId());
        // Process budget-specific notification logic
    }
    
    private void handleInvoiceNotification(NotificationDTO notification) {
        log.info("Handling invoice notification: {}", notification.getId());
        // Process invoice-specific notification logic
    }
    
    private void handleDefaultNotification(NotificationDTO notification) {
        log.info("Handling default notification: {}", notification.getId());
        // Process default notification logic
    }

    public List<NotificationDTO> getUserNotifications(String email) {
        // This method should fetch notifications from the database or any other source
        //return email
        return List.of();

    }

    public void markAsRead(String id) {
        // This method should update the notification status in the database
        // For now, we'll just log it
        log.info("Marking notification as read: {}", id);

    }

    public void markAllAsRead(String email) {
        // This method should update all notifications for the user in the database
        // For now, we'll just log it
        log.info("Marking all notifications as read for email: {}", email);

    }
}