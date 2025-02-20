package com.tensai.financial.Services;

import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Entities.Status;

import java.util.List;

public interface IInvoiceService {
    List<InvoiceDTO> getAllInvoices();
    InvoiceDTO createInvoice(InvoiceDTO dto);
    InvoiceDTO updateInvoice(Long id, InvoiceDTO dto);
    void deleteInvoice(Long id);
    InvoiceDTO getInvoiceById(Long id);
    InvoiceDTO getInvoiceByStatus(Status status);
}
