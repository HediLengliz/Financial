package com.tensai.financial.Entities;

import lombok.Data;

@Data
public class PaymentRequest {
    private String email;
    private double amount;
    private String paymentMethod;
    private String cardNumber;
    private String expiryDate;
    private String cvv;
    private boolean savePaymentInfo;
    private String description;
} 