package com.tensai.financial.Exceptions;

public class FinException extends RuntimeException {
        //an exception for when a budget is not found
        public static class BudgetNotFoundException extends RuntimeException {
            public BudgetNotFoundException(Long id) {
                super("Budget with ID " + id + " not found");
            }
        }
        //an exception for when expenses are not found
        public static class ExpenseNotFoundException extends RuntimeException {
            public ExpenseNotFoundException(Long id) {
                super("Expense with ID " + id + " not found");
            }
        }
        //an exception for when an invoice is not found
        public static class InvoiceNotFoundException extends RuntimeException {
            public InvoiceNotFoundException(Long id) {
                super("Invoice with ID " + id + " not found");
            }
        }
        //an exception for when budget id is not found
        public static class BudgetIdNotFoundException extends RuntimeException {
            public BudgetIdNotFoundException(Long id) {
                super("Budget with ID " + id + " not found");
            }
        }
        //an exception for when an expense id is not found
        public static class ExpenseIdNotFoundException extends RuntimeException {
            public ExpenseIdNotFoundException(Long id) {
                super("Expense with ID " + id + " not found");
            }
        }
        //an exception for when an invoice id is not found
        public static class InvoiceIdNotFoundException extends RuntimeException {
            public InvoiceIdNotFoundException(Long id) {
                super("Invoice with ID " + id + " not found");
            }
        }
        //an exception for when a projectName already exists or more than 100 characters
        public static class ProjectNameException extends RuntimeException {
            public ProjectNameException(String projectName) {
                super("Project name " + projectName + " already exists or is more than 100 characters");
            }
        }
}

