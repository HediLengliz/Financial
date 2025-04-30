package com.buildini.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendPaymentConfirmation(String to, String paymentMethod, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Payment Confirmation");
        message.setText(String.format(
            "Dear Customer,\n\n" +
            "Your payment of %.2f TND has been successfully processed via %s.\n\n" +
            "Thank you for your purchase!\n\n" +
            "Best regards,\n" +
            "Buildini Team", amount, paymentMethod));
        
        mailSender.send(message);
    }
} 