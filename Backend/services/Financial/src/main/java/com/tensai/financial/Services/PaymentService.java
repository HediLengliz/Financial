package com.tensai.financial.Services;

import com.paypal.api.payments.Payment;
import com.stripe.model.Charge;
import com.tensai.financial.Entities.PaymentRequest;
import com.tensai.financial.Services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final KafkaTemplate<String, String> stringKafkaTemplate;
    private final JavaMailSender mailSender;
    private final NotificationService notificationService; // Add this
    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    public Payment processPayPalPayment(PaymentRequest request) {
        try {
            Payment payment = new Payment();
            // Process PayPal payment logic here
            String message = String.format("Your payment of %.2f TND via PayPal was successful", request.getAmount());
            notificationService.sendNotification(
                    message,
                    "PAYMENT",
                    request.getEmail(),
                    payment.getId(), // Assuming Payment has an ID
                    "PAYMENT"
            );
            sendEmailConfirmation(request.getEmail(), "PayPal", request.getAmount(), request.getDescription());
            return payment;
        } catch (Exception e) {
            String message = String.format("Your payment of %.2f TND via PayPal failed", request.getAmount());
            notificationService.sendNotification(
                    message,
                    "PAYMENT",
                    request.getEmail(),
                    null,
                    "PAYMENT"
            );
            throw new RuntimeException("PayPal payment failed: " + e.getMessage());
        }
    }

    public Charge processCardPayment(PaymentRequest request) {
        try {
            Charge charge = new Charge();
            // Process card payment logic here
            String message = String.format("Your payment of %.2f TND via Card was successful", request.getAmount());
            notificationService.sendNotification(
                    message,
                    "PAYMENT",
                    request.getEmail(),
                    charge.getId(), // Assuming Charge has an ID
                    "PAYMENT"
            );
            sendEmailConfirmation(request.getEmail(), "Card", request.getAmount(), request.getDescription());
            return charge;
        } catch (Exception e) {
            String message = String.format("Your payment of %.2f TND via Card failed", request.getAmount());
            notificationService.sendNotification(
                    message,
                    "PAYMENT",
                    request.getEmail(),
                    null,
                    "PAYMENT"
            );
            throw new RuntimeException("Card payment failed: " + e.getMessage());
        }
    }

    private void sendEmailConfirmation(String email, String paymentMethod, double amount, String description) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Payment Confirmation");
        message.setText(String.format(
                "Dear Customer,\n\n" +
                        "Your payment of %.2f TND has been successfully processed via %s.\n" +
                        "Description: %s\n\n" +
                        "Thank you for your purchase!\n\n" +
                        "Best regards,\n" +
                        "Buildini Team", amount, paymentMethod, description));
        mailSender.send(message);
    }
}