import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {StatusPipe} from "../../../pipe/status.pipe";
import {InvoiceService} from "../../../services/invoice.service";
import {Invoice} from "../../../models/invoice";
import { ToastrService } from "ngx-toastr";
import {id} from "@swimlane/ngx-charts";
import {AppTopEmployeesComponent} from "../../top-employees/top-employees.component"; // Make sure to import ToastrService
type SortableColumn = keyof Invoice;
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'app-invoice',
  imports: [
    CurrencyPipe,
    DatePipe,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    RouterOutlet,
    NgClass
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  sortColumn: SortableColumn = 'invoiceNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filter Variables
  searchKeyword: string = '';
  amountSearch?: number;
  createdAt?: string;
  dueDate?: string;
  selectedStatus?: 'Active' | 'Closed' | 'Adjusted' | 'Cancelled';
  private invoiceToDeleteId: number | undefined;
  private toastr: any;

  constructor(private invoiceService: InvoiceService,private route: Router) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.invoiceService.invoiceUpdateSource$.subscribe(() => {
      this.loadInvoices(); // Refresh invoices when notified
    });
  }

  loadInvoices(): void {
    this.isLoading = true;
    this.invoiceService.getInvoicesWithFilters(
      this.searchKeyword,
      this.amountSearch,
      this.createdAt,
      undefined, // budgetId
      this.selectedStatus,
      undefined, // tax
      this.dueDate,
      undefined, // createdAt
      undefined, // issuedBy
      undefined, // issuedTo
      undefined, // amount
      undefined, // approvalStatus
      undefined  // projectId
    ).subscribe({
      next: (data) => {
        this.invoices = data;
        this.filteredInvoices = data; // Initialize filtered invoices
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load invoices';
        this.isLoading = false;
        this.toastr.error('Failed to load invoices', 'Error');
      }
    });
  }

  search(): void {
    this.filteredInvoices = this.invoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(this.searchKeyword.toLowerCase())
    );
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.amountSearch = undefined;
    this.loadInvoices(); // Reload all invoices
  }

  setInvoiceToDelete(id: number | undefined): void {
    this.invoiceToDeleteId = id; // Store the ID of the invoice to be deleted
  }

  confirmDeleteInvoice(): void {
    if (this.invoiceToDeleteId === undefined) return;

    this.invoiceService.deleteInvoice(this.invoiceToDeleteId).subscribe({
      next: () => {
        this.toastr.success('Invoice deleted successfully!', 'Success', { timeOut: 2000, progressBar: true });
        this.invoiceToDeleteId = undefined;
        this.loadInvoices();
      },
      error: (error) => {
        this.toastr.error('Failed to delete invoice', 'Error', { timeOut: 4000, progressBar: true });
        console.error('Delete error:', error);
      },
    });
  }
  sort(column: SortableColumn): void { // Use SortableColumn type
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredInvoices.sort((a, b) => {
      const valueA = a[column] ?? '';
      const valueB = b[column] ?? '';

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  gotoShowInvoice(id: number | undefined): void {
    this.route.navigate(['/financial/invoice', id]);

  }

  deleteInvoice(invoiceId: number | any) {
    console.log('Attempting to delete invoice with ID:', invoiceId); // Log the ID
    if (invoiceId) {
      this.invoiceService.deleteInvoice(invoiceId).subscribe({
        next: () => {
          this.toastr.success('Invoice deleted successfully', 'Success', { timeOut: 4000 });
          this.loadInvoices(); // Refresh the list of invoices
        },
        error: (error) => {
          this.toastr.error('Failed to delete invoice', 'Error', { timeOut: 4000 });
          console.error('Error deleting invoice:', error); // Ensure you log the error
        },
      });
    } else {
      console.error('Invoice ID is null or undefined');
    }
  }
}
