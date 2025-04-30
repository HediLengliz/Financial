package com.tensai.financial.Controllers;

import com.tensai.financial.Entities.PaymentRequest;
import com.tensai.financial.Services.NotificationService;
import com.tensai.financial.Services.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/financial/payments")
@RequiredArgsConstructor
public class PaymentController  {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;
    private final NotificationService notificationService;

    @Operation(summary = "Process payment")
    @PostMapping(value ="/process",consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest request) {
        try {
            ResponseEntity<?> response;
            
            switch (request.getPaymentMethod().toUpperCase()) {
                case "PAYPAL" -> {
                    var result = paymentService.processPayPalPayment(request);
                    response = ResponseEntity.ok(result);
                    
                    // Send notification
                    notificationService.sendNotification(
                            "PayPal payment processed successfully for $" + request.getAmount(),
                            "PAYMENT",
                            request.getEmail(),
                            result.toString(),
                            "PAYMENT"
                    );
                }
                case "CARD" -> {
                    var result = paymentService.processCardPayment(request);
                    response = ResponseEntity.ok(result);
                    
                    // Send notification
                    notificationService.sendNotification(
                            "Card payment processed successfully for $" + request.getAmount(),
                            "PAYMENT",
                            request.getEmail(),
                            result.toString(),
                            "PAYMENT"
                    );
                }
                default -> response = ResponseEntity.badRequest().body("Invalid payment method");
            }
            
            return response;
        } catch (Exception e) {
            // Send error notification
            if (request.getEmail() != null) {
                notificationService.sendNotification(
                        "Payment processing failed: " + e.getMessage(),
                        "PAYMENT_ERROR",
                        request.getEmail(),
                        "ERROR",
                        "PAYMENT"
                );
            }
            
            return ResponseEntity.internalServerError().body("Payment processing failed: " + e.getMessage());
        }
    }
}