package com.tensai.financial.Services;

import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;

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

}
