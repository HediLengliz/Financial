package com.tensai.financial.Services;

import com.tensai.financial.DTOS.NotificationDTO;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service

public class WebSocketNotificationService {
    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    public WebSocketNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "notifications", groupId = "notification-websocket-group")
    public void consume(NotificationDTO notification) {
        // Send to a topic that all users subscribe to (for broadcast notifications)
        messagingTemplate.convertAndSend("/topic/notifications", notification);

        // Send to a queue specific to the recipient (for user-specific notifications)
        if (notification.getRecipientEmail() != null) {
            messagingTemplate.convertAndSend(
                    "/queue/notifications/" + notification.getRecipientEmail(),
                    notification
            );
        }
    }
}
