import { Component, OnInit } from '@angular/core';
import {CommonModule, CurrencyPipe, DatePipe, DecimalPipe, NgClass, NgStyle, TitleCasePipe} from "@angular/common";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";
import { InvoiceService } from "../../../../services/invoice.service";
import { Invoice } from "../../../../models/invoice";
import { ToastrService } from "ngx-toastr";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-show-invoice',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    NgStyle,
    DatePipe,
    CommonModule,

  ],
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.scss']
})
export class ShowInvoiceComponent implements OnInit {
  invoice: Invoice = {
    project_id: 0,
    amount: 0, approvalStatus: "PENDING", budgetId: 0, issueDate: "", issued_to: "", tax: 0, // Initialize with default values
    invoiceNumber: '',
    created_at: "",
    issued_by: '',
    dueDate: "",
    totalAmount: 0,
    status: 'Active'
  };
  showtable: boolean = true;
  progress: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');
    console.log('Fetching invoice with ID:', invoiceId);
    if (invoiceId) {
      this.invoiceService.getInvoiceById(invoiceId).subscribe({
        next: (invoice) => {
          this.invoice = invoice;
          console.log('Invoice loaded:', this.invoice);
        },
        error: (error) => {
          this.toastr.error('Failed to load invoice', 'Error', { timeOut: 4000, progressBar: true });
          console.error('Error loading invoice:', error);
        },
      });
    }
  }

  goBack() {
    this.showtable = true;
    this.router.navigate(['/financial/invoice']);
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${this.invoice.invoiceNumber}`, 10, 10);
    doc.text(`Total Amount: ${this.invoice.totalAmount}`, 10, 20);
    // Add more details as needed
    autoTable(doc, { html: '#invoice-table' }); // Add a table if you have one
    doc.save(`${this.invoice.invoiceNumber}.pdf`);
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet([this.invoice]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');
    XLSX.writeFile(workbook, `${this.invoice.invoiceNumber}.xlsx`);
  }

  exportToWord() {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(`Invoice Number: ${this.invoice.invoiceNumber}`),
              new TextRun({
                text: `\nTotal Amount: ${this.invoice.totalAmount}`,
                break: 1,
              }),
              new TextRun(`Created At: ${this.invoice.created_at}`),
              new TextRun(`\nIssued By: ${this.invoice.issued_by}`),
              new TextRun(`\nDue Date: ${this.invoice.dueDate}`),
              new TextRun(`\nStatus: ${this.invoice.status}`),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${this.invoice.invoiceNumber}.docx`);
    }).catch((error) => {
      console.error("Error generating Word document:", error);
    });
  }
}
