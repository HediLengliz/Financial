package com.tensai.financial.Services;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.tensai.financial.DTOS.InvoiceDTO;
import com.tensai.financial.Entities.ApprovalStatus;
import com.tensai.financial.Entities.Budget;
import com.tensai.financial.Entities.Invoice;
import com.tensai.financial.Entities.Status;
import com.tensai.financial.FeignClients.ProjectClient;
import com.tensai.financial.FeignClients.SupplierClient;
import com.tensai.financial.Repositories.BudgetRepository;
import com.tensai.financial.Repositories.InvoiceRepository;
import lombok.AllArgsConstructor;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.wml.*;
import org.springframework.stereotype.Service;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.docx4j.wml.P;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InvoiceService implements IInvoiceService {
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
                        .approvalStatus(invoice.getApprovalStatus())
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
                .projectId(dto.getProjectId())
                .approvalStatus(dto.getApprovalStatus())
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
                .projectId(savedInvoice.getProjectId())
                .approvalStatus(savedInvoice.getApprovalStatus())
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
        invoice.getBudget().setId(dto.getBudgetId());
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
    //wa9telli fournisseur ysubmiti invoice  fonc hedhy taml auto matching tchouf est ce que tcouvri lexpenses wale

    @Override
    public void autoApproveInvoice(Long id, UUID project_id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        BigDecimal totalAmount = invoice.getTotalAmount();
        if (totalAmount.compareTo(invoice.getAmount()) >= 0) {
            invoice.setApprovalStatus(ApprovalStatus.APPROVED);
        } else {
            invoice.setApprovalStatus(ApprovalStatus.REJECTED);
        }
        invoiceRepository.save(invoice);
    }

    @Override
    public List<Invoice> getUpcomingPayments() {
        return List.of();
    }

    @Override
    public void scheduleInvoicePayment(Long id, Integer installmentCount) {
//        Invoice invoice = invoiceRepository.findById(invoiceId)
//                .orElseThrow(() -> new RuntimeException("Invoice not found"));
//
//        BigDecimal installmentAmount = invoice.getAmount().divide(new BigDecimal(installmentCount), RoundingMode.HALF_UP);
//
//        for (int i = 1; i <= installmentCount; i++) {
//            ScheduledPayment payment = new ScheduledPayment(UUID.randomUUID(), id, installmentAmount, invoice.getDueDate().plusDays(30 * i));
//            scheduledPaymentRepository.save(payment);
//        }

    }

    @Override
    public List<InvoiceDTO> loadAllInvoicesWithFilters(String invoiceNumber, BigDecimal amount, BigDecimal totalAmount, String issued_by, String issued_to, LocalDate issueDate, BigDecimal tax, LocalDate dueDate, LocalDate created_at, Status status, ApprovalStatus approvalStatus) {
        return invoiceRepository.findAllByFilters(invoiceNumber, amount, totalAmount, issued_by, issued_to, issueDate, tax, dueDate, created_at, status, approvalStatus)
                .stream()
                .map(invoice -> InvoiceDTO.builder()
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
                        .approvalStatus(invoice.getApprovalStatus())
                        .build())
                .collect(Collectors.toList());
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        return InvoiceDTO.builder()
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
                .approvalStatus(invoice.getApprovalStatus())
                .build();
    }

    public List<InvoiceDTO> loadAllBudgetsWithFilters
            (
                    String invoiceNumber,
                    BigDecimal amount,
                    BigDecimal totalAmount,
                    String issued_by,
                    String issued_to,
                    LocalDate issueDate,
                    BigDecimal tax,
                    LocalDate dueDate,
                    LocalDate created_at,
                    Status status,
                    ApprovalStatus approvalStatus


            ) {

        List<Invoice> invoices = invoiceRepository.findAll(); // Load all budgets

        // Filter based on provided criteria
        return invoices.stream()
                .filter(invoice -> invoice.getInvoiceNumber().equals(invoiceNumber) || invoiceNumber == null)
                .filter(invoice -> invoice.getAmount().equals(amount) || amount == null)
                .filter(invoice -> invoice.getTotalAmount().equals(totalAmount) || totalAmount == null)
                .filter(invoice -> invoice.getIssued_by().equals(issued_by) || issued_by == null)
                .filter(invoice -> invoice.getIssued_to().equals(issued_to) || issued_to == null)
                .filter(invoice -> invoice.getIssueDate().equals(issueDate) || issueDate == null)
                .filter(invoice -> invoice.getTax().equals(tax) || tax == null)
                .filter(invoice -> invoice.getDueDate().equals(dueDate) || dueDate == null)
                .filter(invoice -> invoice.getCreated_at().equals(created_at) || created_at == null)
                .filter(invoice -> invoice.getStatus().equals(status) || status == null)
                .filter(invoice -> invoice.getApprovalStatus().equals(approvalStatus) || approvalStatus == null)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ByteArrayOutputStream generatePdf(Long id) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            // Initialize PdfWriter with the output stream
            PdfWriter.getInstance(document, outputStream);

            // Open the document to write
            document.open();

            // Retrieve the invoice data
            InvoiceDTO invoiceDTO = getInvoiceById(id);

            // Add content to the PDF
            document.add(new Paragraph("Invoice Number: " + invoiceDTO.getInvoiceNumber()));
            document.add(new Paragraph("Total Amount: " + invoiceDTO.getTotalAmount()));
            document.add(new Paragraph("Status: " + invoiceDTO.getStatus()));
            // Add more invoice details as needed...

        } catch (DocumentException e) {
            e.printStackTrace(); // Handle exceptions appropriately in production code
        } finally {
            document.close(); // Ensure the document is closed in a finally block
        }

        return outputStream; // Return the output stream containing the PDF
    }

    public ByteArrayOutputStream generateExcel(Long id) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        org.apache.poi.ss.usermodel.Workbook workbook = new XSSFWorkbook(); // Create a new workbook instance for .xlsx files

        try {
            InvoiceDTO invoice = getInvoiceById(id);
            Sheet sheet = workbook.createSheet("Invoice"); // Create a new sheet

            // Create header row
            org.apache.poi.ss.usermodel.Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Invoice Number");
            header.createCell(1).setCellValue("Total Amount");
            header.createCell(1).setCellValue("Status");
            // Add more headers1 as needed...

            // Create a row for invoice data
            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue(invoice.getInvoiceNumber());
            dataRow.createCell(1).setCellValue(String.valueOf(invoice.getTotalAmount()));
            dataRow.createCell(1).setCellValue((invoice.getStatus() == null) ? "" : invoice.getStatus().name());

            // Add more invoice details...

            // Write the output to the ByteArrayOutputStream
            workbook.write(outputStream);
        } catch (IOException e) {
            e.printStackTrace(); // Handle exceptions appropriately
        } finally {
            try {
                workbook.close(); // Ensure the workbook is closed
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return outputStream; // Return the output stream containing the Excel file
    }
    public ByteArrayOutputStream generateWord(Long id) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try {
            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.createPackage();
            ObjectFactory factory = new ObjectFactory();

            // Add a paragraph
            P paragraph = factory.createP();
            R run = factory.createR();
            Text text = factory.createText();
            text.setValue("Invoice Number: " + getInvoiceById(id).getInvoiceNumber());
            run.getContent().add(text);
            paragraph.getContent().add(run);
            wordMLPackage.getMainDocumentPart().addObject(paragraph);

            // Add more content as needed...

            // Save to output stream
            wordMLPackage.save(outputStream);
        } catch (Exception e) {
            e.printStackTrace(); // Handle exceptions appropriately
        }

        return outputStream; // Return the output stream containing the Word document
    }


}


