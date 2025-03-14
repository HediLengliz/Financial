import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

import {PieChartModule} from "@swimlane/ngx-charts";
import {InvoiceService} from "../../../../services/invoice.service";
import {Invoice} from "../../../../models/invoice";
import {CurrencyPipe, DatePipe} from "@angular/common";
import autoTable from "jspdf-autotable";
import { ToastrService } from "ngx-toastr";
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-show-invoice',
  template: `
    <div class="container mt-4">
      <h3>Invoice Details</h3>
      <div class="card p-4 shadow-sm">
        <div class="row">
          <div class="col-md-6">
            <p><strong>Invoice Number:</strong> {{ invoice?.invoiceNumber }}</p>
            <p><strong>Total Amount:</strong> {{ invoice?.totalAmount | currency: 'USD' }}</p>
            <p><strong>Status:</strong> {{ invoice?.status }}</p>
            <p><strong>Due Date:</strong> {{ invoice?.dueDate | date: 'medium' }}</p>
            <p><strong>Issued By:</strong> {{ invoice?.issued_by }}</p>
            <p><strong>Issued To:</strong> {{ invoice?.issued_to }}</p>
            <p><strong>Issue Date:</strong> {{ invoice?.issueDate | date: 'medium' }}</p>
            <p><strong>Tax:</strong> {{ invoice?.tax | currency: 'USD' }}</p>
          </div>
          <div class="col-md-6 chart-container">
            <h4>Total Amount Breakdown</h4>
            <ngx-charts-pie-chart
              [results]="chartData"
              [gradient]="true"
              [legend]="true"
              [labels]="true"
              [animations]="true"
              [doughnut]="true"
            class="futuristic-chart"
            ></ngx-charts-pie-chart>
          </div>
          <div class="button-group">
            <button class="export-btn" (click)="exportToPDF()">Export as PDF</button>
            <button class="export-btn" (click)="exportToExcel()">Export as Excel</button>
            <button class="export-btn" (click)="exportToWord()">Export as Word</button>
          </div>
        </div>
        <a [routerLink]="['/financial/invoice']" class="back-to-invoice-btn">Back to Invoices</a>
      </div>
    </div>
  `,
  imports: [
    PieChartModule,
    RouterLink,
    CurrencyPipe,
    DatePipe
  ],
  styleUrls: ['./show-invoice.component.scss'],
})
export class ShowInvoiceComponent implements OnInit {
  invoice: Invoice | undefined;
  chartData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.invoiceService.getInvoiceById(id).subscribe({
      next: (invoice) => {
        this.invoice = invoice;
        this.chartData = [
          { name: 'Tax', value: invoice.tax || 0 },
          { name: 'Base Amount', value: invoice.totalAmount - (invoice.tax || 0) },
          { name: 'Amount', value: invoice.amount || 0 },
        ];
      },
      error: (err) => console.error('Failed to load invoice', err)
    });
  }
  exportToPDF() {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${this.invoice?.invoiceNumber}`, 10, 10);
    doc.text(`Total Amount: ${this.invoice?.totalAmount}`, 10, 20);
    // Add more details as needed
    autoTable(doc, { html: '#invoice-table' }); // Add a table if you have one
    doc.save(`${this.invoice?.invoiceNumber}.pdf`);
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet([this.invoice]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');
    XLSX.writeFile(workbook, `${this.invoice?.invoiceNumber}.xlsx`);
  }

  exportToWord() {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun(`Invoice Number: ${this.invoice?.invoiceNumber}`),
              new TextRun({
                text: `\nTotal Amount: ${this.invoice?.totalAmount}`,
                break: 1,
              }),
              new TextRun(`Created At: ${this.invoice?.created_at}`),
              new TextRun(`\nIssued By: ${this.invoice?.issued_by}`),
              new TextRun(`\nDue Date: ${this.invoice?.dueDate}`),
              new TextRun(`\nStatus: ${this.invoice?.status}`),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${this.invoice?.invoiceNumber}.docx`);
    }).catch((error) => {
      console.error("Error generating Word document:", error);
    });
  }
}
