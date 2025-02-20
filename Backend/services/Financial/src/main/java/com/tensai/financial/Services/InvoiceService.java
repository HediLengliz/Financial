package com.tensai.financial.Services;

import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.DTOS.ProjectDTO;
import com.tensai.financial.DTOS.SupplierDTO;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.FeignClients.ProjectClient;
import com.tensai.financial.FeignClients.SupplierClient;
import com.tensai.financial.Repositories.BudgetRepository;
import com.tensai.financial.Repositories.InvoiceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InvoiceService implements IInvoiceService{
    private final InvoiceRepository invoiceRepository;
    private final BudgetRepository budgetRepository;
    private final ProjectClient projectClient;
    private final SupplierClient supplierClient;

    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll()
                .stream()
                .map(invoice -> InvoiceDTO.builder()
                        .id(invoice.getId())
                        .invoiceNumber(invoice.getInvoiceNumber())
                        .totalAmount(invoice.getTotalAmount())
                        .issueDate(invoice.getIssueDate())
                        .budgetId(invoice.getBudget().getId())
                        .issued_by(invoice.getIssued_by())
                        .tax(invoice.getTax())
                        .dueDate(invoice.getDueDate())
                        .created_at(invoice.getCreated_at())
                        .issued_to(invoice.getIssued_to())
                        .amount(invoice.getAmount())
                        .status(invoice.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

    public InvoiceDTO createInvoice(InvoiceDTO dto) {
        Budget budget = budgetRepository.findById(dto.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));

        Invoice invoice = Invoice.builder()
                .id(dto.getId())
                .invoiceNumber(dto.getInvoiceNumber())
                .totalAmount(dto.getTotalAmount())
                .issueDate(dto.getIssueDate())
                .issued_by(dto.getIssued_by())
                .tax(dto.getTax())
                .dueDate(dto.getDueDate())
                .created_at(dto.getCreated_at())
                .issued_to(dto.getIssued_to())
                .amount(dto.getAmount())
                .status(dto.getStatus())
                .budget(budget)
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return InvoiceDTO.builder()
                .id(savedInvoice.getId())
                .invoiceNumber(savedInvoice.getInvoiceNumber())
                .totalAmount(savedInvoice.getTotalAmount())
                .issueDate(savedInvoice.getIssueDate())
                .issued_by(savedInvoice.getIssued_by())
                .tax(savedInvoice.getTax())
                .dueDate(savedInvoice.getDueDate())
                .created_at(savedInvoice.getCreated_at())
                .issued_to(savedInvoice.getIssued_to())
                .amount(savedInvoice.getAmount())
                .status(savedInvoice.getStatus())
                .budgetId(savedInvoice.getBudget().getId())
                .build();
    }
    public InvoiceDTO updateInvoice(Long id, InvoiceDTO dto) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        Budget budget = budgetRepository.findById(dto.getBudgetId())
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setTotalAmount(dto.getTotalAmount());
        invoice.setIssueDate(dto.getIssueDate());
        invoice.setIssued_by(dto.getIssued_by());
        invoice.setTax(dto.getTax());
        invoice.setDueDate(dto.getDueDate());
        invoice.setCreated_at(dto.getCreated_at());
        invoice.setIssued_to(dto.getIssued_to());
        invoice.setAmount(dto.getAmount());
        invoice.setStatus(dto.getStatus());
        invoice.setBudget(budget);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return InvoiceDTO.builder()
                .id(savedInvoice.getId())
                .invoiceNumber(savedInvoice.getInvoiceNumber())
                .totalAmount(savedInvoice.getTotalAmount())
                .issueDate(savedInvoice.getIssueDate())
                .issued_by(savedInvoice.getIssued_by())
                .tax(savedInvoice.getTax())
                .dueDate(savedInvoice.getDueDate())
                .created_at(savedInvoice.getCreated_at())
                .issued_to(savedInvoice.getIssued_to())
                .amount(savedInvoice.getAmount())
                .status(savedInvoice.getStatus())
                .budgetId(savedInvoice.getBudget().getId())
                .build();
    }
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }
    public InvoiceDTO getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        ProjectDTO project = projectClient.getProjectById(invoice.getProjectId());
        SupplierDTO supplier = supplierClient.getSupplierById(invoice.getSupplierId());
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .totalAmount(invoice.getTotalAmount())
                .issueDate(invoice.getIssueDate())
                .issued_by(invoice.getIssued_by())
                .tax(invoice.getTax())
                .dueDate(invoice.getDueDate())
                .created_at(invoice.getCreated_at())
                .issued_to(invoice.getIssued_to())
                .amount(invoice.getAmount())
                .status(invoice.getStatus())
                .budgetId(invoice.getBudget().getId())
                .build();

    }

    @Override
    public InvoiceDTO getInvoiceByStatus(Status status) {
        Invoice invoice = invoiceRepository.findByStatus(status)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return InvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .totalAmount(invoice.getTotalAmount())
                .issueDate(invoice.getIssueDate())
                .issued_by(invoice.getIssued_by())
                .tax(invoice.getTax())
                .dueDate(invoice.getDueDate())
                .created_at(invoice.getCreated_at())
                .issued_to(invoice.getIssued_to())
                .amount(invoice.getAmount())
                .status(invoice.getStatus())
                .budgetId(invoice.getBudget().getId())
                .build();
    }

}
