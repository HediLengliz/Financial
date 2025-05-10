package com.tensai.financial.Controllers;


import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.Services.InvoiceService;
import com.tensai.financial.Services.PdfGenerator;
import com.tensai.financial.Services.QrCodeGenerator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.hc.core5.http.HttpHeaders;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/financial/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoice Management", description = "APIs for managing invoices")
public class InvoiceController {
    private final PdfGenerator pdfGenerator;
    private final QrCodeGenerator qrCodeGenerator;
    private final InvoiceService invoiceService;
    @GetMapping("/all")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invoice details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    @Operation(summary = "Get all invoices", description = "Fetches a list of all invoices.")
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PostMapping("/create")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invoice details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    @Operation(summary = "Create an invoice", description = "Creates a new invoice entry.")
    public ResponseEntity<InvoiceDTO> createInvoice(@RequestBody InvoiceDTO invoiceDTO) {
        if (invoiceDTO.getProjectId() == null) {
            invoiceDTO.setProjectId(UUID.randomUUID()); // Generate a new UUID if not provided
        }
        return ResponseEntity.ok(invoiceService.createInvoice(invoiceDTO));
    }
    @DeleteMapping("/delete/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invoice details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    @Operation(summary = "Delete an invoice", description = "Deletes an invoice entry.")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invoice details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    @Operation(summary = "Update an invoice", description = "Updates an invoice entry.")
    public ResponseEntity<InvoiceDTO> updateInvoice(@PathVariable Long id, @RequestBody InvoiceDTO invoiceDTO) {
        if (id == null) {
            throw new IllegalArgumentException("Invoice ID must not be null");
        }
        InvoiceDTO updatedInvoice = invoiceService.updateInvoice(id, invoiceDTO);
        return ResponseEntity.ok(updatedInvoice);

    }
    @GetMapping("/get/{id}")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Invoice details retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Invoice not found")
    })
    @Operation(summary = "Get an invoice", description = "Fetches an invoice entry.")
    public ResponseEntity<InvoiceDTO> getInvoice(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }
    @GetMapping("/load-with-filters")
    @Operation(summary = "Load All Budgets with Filters", description = "Fetches all invoices with optional filtering parameters.")
    public ResponseEntity<List<InvoiceDTO>> loadInvoicesWithFilters(
            @RequestParam(value = "invoiceNumber", required = false) String invoiceNumber,
            @RequestParam(value = "amount", required = false) BigDecimal amount,
            @RequestParam(value = "totalAmount", required = false) BigDecimal totalAmount,
            @RequestParam(value = "issued_by", required = false) String issued_by,
            @RequestParam(value = "issued_to", required = false) String issued_to,
            @RequestParam(value = "issueDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate issueDate,
            @RequestParam(value = "tax", required = false) BigDecimal tax,
            @RequestParam(value = "dueDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(value = "created_at", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate created_at,
            @RequestParam(value = "approvalStatus", required = false) ApprovalStatus approvalStatus,
            @RequestParam(value = "status", required = false) Status status) {

        List<InvoiceDTO> filteredInvoices = invoiceService.loadAllInvoicesWithFilters(invoiceNumber,amount, totalAmount, issued_by,  issued_to,  issueDate, tax, dueDate, created_at,  status, approvalStatus);
        return ResponseEntity.ok(filteredInvoices);
    }
    // New endpoint for PDF of all invoices
    @GetMapping("/export/pdf/{id}")
    @Operation(summary = "Download PDF of all invoices", description = "Generates a PDF containing all invoices.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PDF generated successfully"),
            @ApiResponse(responseCode = "500", description = "Error generating PDF")
    })
    public ResponseEntity<byte[]> downloadAllInvoicesPdf() {
        List<InvoiceDTO> invoices = invoiceService.getAllInvoices();
        byte[] pdfBytes = pdfGenerator.generateInvoicesPdf(invoices);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=all_invoices.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // New endpoint for QR code
    @GetMapping("/all/pdf/qrcode")
    @Operation(summary = "Get QR code for all invoices PDF", description = "Generates a QR code linking to the PDF of all invoices.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "QR code generated successfully"),
            @ApiResponse(responseCode = "500", description = "Error generating QR code")
    })
    public ResponseEntity<byte[]> getAllInvoicesPdfQrCode() {
        // Construct the URL for the PDF endpoint (adjust the base URL as needed)
        String pdfUrl = "http://localhost:8080/financial/invoices/all/pdf"; // Replace with your actual host/port
        byte[] qrCodeBytes = qrCodeGenerator.generateQrCode(pdfUrl, 250, 250);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=invoices-qrcode.png")
                .contentType(MediaType.IMAGE_PNG)
                .body(qrCodeBytes);
    }

    @GetMapping("/export/excel/{id}")
    public ResponseEntity<byte[]> exportExcel(@PathVariable Long id) {
        ByteArrayOutputStream outputStream = invoiceService.generateExcel(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + id + ".xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(outputStream.toByteArray());
    }

    @GetMapping("/export/word/{id}")
    public ResponseEntity<byte[]> exportWord(@PathVariable Long id) {
        ByteArrayOutputStream outputStream = invoiceService.generateWord(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=invoice_" + id + ".docx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(outputStream.toByteArray());
    }

}
