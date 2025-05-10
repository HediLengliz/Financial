import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InvoiceService } from '../../../../services/invoice.service';
import { Invoice } from '../../../../models/invoice';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, TitleCasePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import {MatCardContent, MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive, NgApexchartsModule,
} from 'ng-apexcharts';

export interface invoiceChart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  labels: string[];
  responsive: ApexResponsive[];
}

@Component({
  selector: 'app-show-invoice',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TitleCasePipe,
    TablerIconsModule,
    NgClass,
    NgForOf,
    NgApexchartsModule,
    MatCardContent
  ],
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.scss'],
})
export class ShowInvoiceComponent implements OnInit {
  invoice: Invoice | undefined;
  chartData: any[] = [];
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public invoiceChart!: Partial<invoiceChart> | any;

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
          { name: 'Tax', value: invoice.tax || 0, color: 'text-primary' },
          { name: 'Base Amount', value: (invoice.totalAmount || 0) - (invoice.tax || 0), color: 'text-warning' },
          { name: 'Amount', value: invoice.amount || 0, color: 'text-error' },
        ];

        this.invoiceChart = {
          series: this.chartData.map((item: any) => item.value),
          labels: this.chartData.map((item: any) => item.name),
          chart: {
            type: 'donut',
            fontFamily: 'inherit',
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 160,
          },
          colors: ['#0085db', '#f7c32e', '#fb977d'], // Matching Traffic Distribution colors
          plotOptions: {
            pie: {
              donut: {
                size: '80%',
                background: 'none',
                labels: {
                  show: true,
                  name: {
                    show: true,
                    fontSize: '12px',
                    color: undefined,
                    offsetY: 5,
                  },
                  value: {
                    show: false,
                    color: '#98aab4',
                  },
                },
              },
            },
          },
          stroke: {
            show: false,
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          responsive: [
            {
              breakpoint: 991,
              options: {
                chart: {
                  width: 120,
                },
              },
            },
          ],
          tooltip: {
            enabled: false,
          },
        };
      },
      error: (err) => console.error('Failed to load invoice', err),
    });
  }

  calculatePercentage(value: number | undefined, total: number | undefined): string {
    if (!value || !total || total === 0) return '0';
    return ((value / total) * 100).toFixed(1);
  }

  exportToPDF() {
    const doc = new jsPDF();
    const margin = 15;
    let cursorY = margin;

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(33, 33, 33);
    doc.text('Invoice Summary', margin, cursorY);

    cursorY += 12;

    // Invoice Info as Table
    const invoiceTableBody = [
      ['Invoice Number', this.invoice?.invoiceNumber || '—'],
      ['Total Amount', `${this.invoice?.totalAmount ?? 0} USD`],
      ['Tax', `${this.invoice?.tax ?? 0} USD`],
      ['Amount (Excl. Tax)', `${this.invoice?.amount ?? 0} USD`],
      ['Status', this.invoice?.status || '—'],
      ['Approval Status', this.invoice?.approvalStatus || '—'],
      ['Issued By', this.invoice?.issued_by || '—'],
      ['Issued To', this.invoice?.issued_to || '—'],
      ['Issue Date', this.invoice?.issueDate || '—'],
      ['Due Date', this.invoice?.dueDate || '—'],
      ['Created At', this.invoice?.created_at || '—'],
    ];

    autoTable(doc, {
      startY: cursorY,
      head: [['Field', 'Value']],
      body: invoiceTableBody,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        textColor: 50,
        halign: 'left',
        valign: 'middle',
        lineColor: [220, 220, 220],
        lineWidth: 0.5,
        cellPadding: { top: 5, right: 5, bottom: 5, left: 5 },
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: 255,
        fontSize: 11,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 120 },
      },
      margin: { left: margin, right: margin },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(33, 150, 243);
    doc.rect(0, pageHeight - 20, 210, 20, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('Generated by Tensai Financial System', margin, pageHeight - 10);
    doc.text(`Page ${doc.getNumberOfPages()}`, 200 - margin, pageHeight - 10, { align: 'right' });

    // Save
    doc.save(`${this.invoice?.invoiceNumber || 'invoice'}.pdf`);
  }

  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet([this.invoice]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoice');
    XLSX.writeFile(workbook, `${this.invoice?.invoiceNumber}.xlsx`);
  }

  exportToWord() {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun(`Invoice Number: ${this.invoice?.invoiceNumber}`),
                new TextRun({ text: `\nTotal Amount: ${this.invoice?.totalAmount}`, break: 1 }),
                new TextRun(`Created At: ${this.invoice?.created_at}`),
                new TextRun(`\nIssued By: ${this.invoice?.issued_by}`),
                new TextRun(`\nDue Date: ${this.invoice?.dueDate}`),
                new TextRun(`\nStatus: ${this.invoice?.status}`),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${this.invoice?.invoiceNumber}.docx`);
    }).catch((error) => {
      console.error('Error generating Word document:', error);
    });
  }

  getStatusColor(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'CLOSED':
        return 'primary';
      case 'ADJUSTED':
        return 'warning';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getStatusIcon(status: string | undefined): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'check_circle';
      case 'CLOSED':
        return 'lock';
      case 'ADJUSTED':
        return 'edit';
      case 'CANCELLED':
        return 'cancel';
      default:
        return 'help';
    }
  }
}
