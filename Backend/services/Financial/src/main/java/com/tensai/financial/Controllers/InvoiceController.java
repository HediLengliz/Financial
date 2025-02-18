package com.tensai.financial.Controllers;

import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Services.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoice Management", description = "APIs for managing invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;
    @GetMapping("/all")
    @Operation(summary = "Get all invoices", description = "Fetches a list of all invoices.")
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PostMapping("/create")
    @Operation(summary = "Create an invoice", description = "Creates a new invoice entry.")
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        return ResponseEntity.ok(invoiceService.createInvoice(invoiceDTO));
    }
    @DeleteMapping("/delete/{id}")
    @Operation(summary = "Delete an invoice", description = "Deletes an invoice entry.")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    @Operation(summary = "Update an invoice", description = "Updates an invoice entry.")
    public ResponseEntity<InvoiceDTO> updateInvoice(@RequestBody InvoiceDTO invoiceDTO, @PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.updateInvoice(id, invoiceDTO));
    }
    @GetMapping("/get/{id}")
    @Operation(summary = "Get an invoice", description = "Fetches an invoice entry.")
    public ResponseEntity<InvoiceDTO> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

}
