package com.tensai.financial.Services;

import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IInvoiceService {
    List<InvoiceDTO> getAllInvoices();
    InvoiceDTO createInvoice(InvoiceDTO dto);
    InvoiceDTO updateInvoice(Long id, InvoiceDTO dto);
    void deleteInvoice(Long id);
    InvoiceDTO getInvoiceById(Long id);
    InvoiceDTO getInvoiceByStatus(Status status);
    public void autoApproveInvoice(Long id, UUID project_id);
    public List<Invoice> getUpcomingPayments();
    public void scheduleInvoicePayment(Long id, Integer installmentCount);

    List<InvoiceDTO> loadAllInvoicesWithFilters(String invoiceNumber, BigDecimal amount, BigDecimal totalAmount, String issued_by, String issued_to, LocalDate issueDate, BigDecimal tax, LocalDate dueDate, LocalDate created_at, Status status, ApprovalStatus approvalStatus);
}
