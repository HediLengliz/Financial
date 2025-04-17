package com.tensai.financial.Services;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.tensai.financial.DTOS.InvoiceDTO;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Component
public class PdfGenerator {

    public byte[] generateInvoicesPdf(List<InvoiceDTO> invoices) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Header
            document.add(new Paragraph()
                    .setBackgroundColor(new DeviceRgb(10, 25, 50))
                    .add(new Text("INVOICE")
                            .setFontColor(new DeviceRgb(0, 255, 255))
                            .setFontSize(20)
                            .setBold())
                    .add(new Text(" #" + invoices.get(0).getId())
                            .setFontColor(ColorConstants.WHITE)
                            .setFontSize(12))
                    .setPadding(10)
                    .setTextAlignment(TextAlignment.CENTER));

            // Company Info
            document.add(new Paragraph()
                    .add(new Text("Tensai Financial\n123 Future St, Tech City\nsupport@tensai.fin")
                            .setFontColor(ColorConstants.WHITE)
                            .setFontSize(8))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginBottom(10));

            // Table Headers
            Table table = new Table(new float[]{200, 300});
            table.setWidth(500);
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Field")
                            .setFontColor(ColorConstants.WHITE)
                            .setBold())
                    .setBackgroundColor(new DeviceRgb(0, 100, 255))
                    .setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell()
                    .add(new Paragraph("Value")
                            .setFontColor(ColorConstants.WHITE)
                            .setBold())
                    .setBackgroundColor(new DeviceRgb(0, 100, 255))
                    .setTextAlignment(TextAlignment.CENTER));

            // Table Rows
            for (InvoiceDTO invoice : invoices) {
                addTableRow(table, "Invoice Number", invoice.getInvoiceNumber() != null ? invoice.getInvoiceNumber() : "N/A");
                addTableRow(table, "Total Amount", invoice.getTotalAmount() != null ? String.format("$%.2f", invoice.getTotalAmount()) : "$0.00");
                addTableRow(table, "Issue Date", invoice.getIssueDate() != null ? invoice.getIssueDate().toString() : "N/A");
                addTableRow(table, "Due Date", invoice.getDueDate() != null ? invoice.getDueDate().toString() : "N/A");
                addTableRow(table, "Issued By", invoice.getIssued_by() != null ? invoice.getIssued_by() : "N/A");
                addTableRow(table, "Issued To", invoice.getIssued_to() != null ? invoice.getIssued_to() : "N/A");
                addTableRow(table, "Tax", invoice.getTax() != null ? String.format("$%.2f", invoice.getTax()) : "$0.00");
                addTableRow(table, "Status", invoice.getStatus() != null ? invoice.getStatus().toString() : "N/A");
            }

            document.add(table);

            // Amount Breakdown
            document.add(new Paragraph("Amount Breakdown")
                    .setFontColor(new DeviceRgb(0, 255, 255))
                    .setFontSize(12)
                    .setBold()
                    .setMarginTop(10));

            Table breakdownTable = new Table(new float[]{150, 100});
            breakdownTable.setWidth(250);
            breakdownTable.addHeaderCell(new Cell()
                    .add(new Paragraph("Component")
                            .setFontColor(ColorConstants.WHITE)
                            .setBold())
                    .setBackgroundColor(new DeviceRgb(0, 100, 255)));
            breakdownTable.addHeaderCell(new Cell()
                    .add(new Paragraph("Amount")
                            .setFontColor(ColorConstants.WHITE)
                            .setBold())
                    .setBackgroundColor(new DeviceRgb(0, 100, 255))
                    .setTextAlignment(TextAlignment.RIGHT));

            for (InvoiceDTO invoice : invoices) {
                double baseAmount = (invoice.getTotalAmount() != null ? invoice.getTotalAmount().doubleValue() : 0) -
                        (invoice.getTax() != null ? invoice.getTax().doubleValue() : 0);
                addTableRow(breakdownTable, "Base Amount", String.format("$%.2f", baseAmount));
                addTableRow(breakdownTable, "Tax", invoice.getTax() != null ? String.format("$%.2f", invoice.getTax()) : "$0.00");
                addTableRow(breakdownTable, "Total", invoice.getTotalAmount() != null ? String.format("$%.2f", invoice.getTotalAmount()) : "$0.00");
            }

            document.add(breakdownTable);

            // Footer
            document.add(new Paragraph()
                    .setFixedPosition(10, 30, 500)
                    .setBackgroundColor(new DeviceRgb(10, 25, 50))
                    .add(new Text("Generated by Tensai Financial")
                            .setFontColor(new DeviceRgb(0, 255, 255))
                            .setFontSize(8))
                    .add(new Text(" | Page " + pdf.getNumberOfPages())
                            .setFontColor(new DeviceRgb(0, 255, 255))
                            .setFontSize(8))
                    .setPadding(5));

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
        return baos.toByteArray();
    }

    private void addTableRow(Table table, String field, String value) {
        table.addCell(new Cell()
                .add(new Paragraph(field)
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(20, 40, 80)));
        table.addCell(new Cell()
                .add(new Paragraph(value)
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(new DeviceRgb(20, 40, 80))
                .setTextAlignment(TextAlignment.RIGHT));
    }
}