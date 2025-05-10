package com.buildini.payment;

import com.paypal.api.payments.Payment;
import com.stripe.model.Charge;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PaymentService {
    
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private RestTemplate restTemplate;
    
    public Payment processPayPalPayment(PaymentRequest request) {
        try {
            // Implement PayPal payment logic
            Payment payment = new Payment();
            // Process payment
            sendPaymentNotification("PAYPAL", "SUCCESS");
            sendEmailConfirmation(request.getEmail(), "PayPal", request.getAmount());
            return payment;
        } catch (Exception e) {
            sendPaymentNotification("PAYPAL", "FAILED");
            throw new RuntimeException("PayPal payment failed: " + e.getMessage());
        }
    }
    
    public Charge processCardPayment(PaymentRequest request) {
        try {
            // Implement card payment logic
            Charge charge = new Charge();
            // Process payment
            sendPaymentNotification("CARD", "SUCCESS");
            sendEmailConfirmation(request.getEmail(), "Card", request.getAmount());
            return charge;
        } catch (Exception e) {
            sendPaymentNotification("CARD", "FAILED");
            throw new RuntimeException("Card payment failed: " + e.getMessage());
        }
    }
    
    public void processD17Payment(PaymentRequest request) {
        try {
            // Implement D17 payment logic
            sendPaymentNotification("D17", "SUCCESS");
            sendEmailConfirmation(request.getEmail(), "D17", request.getAmount());
        } catch (Exception e) {
            sendPaymentNotification("D17", "FAILED");
            throw new RuntimeException("D17 payment failed: " + e.getMessage());
        }
    }
    
    private void sendPaymentNotification(String paymentMethod, String status) {
        String message = String.format("Payment processed via %s with status: %s", paymentMethod, status);
        kafkaTemplate.send("payment-notifications", message);
    }
    
    private void sendEmailConfirmation(String email, String paymentMethod, double amount) {
        emailService.sendPaymentConfirmation(email, paymentMethod, amount);
    }
} 