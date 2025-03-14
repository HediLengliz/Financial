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
import {debounceTime, Subject} from "rxjs";
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
  filteredInvoices: Invoice[] = [];
  private invoices: Invoice[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  sortColumn: SortableColumn = 'invoiceNumber';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Filter Variables
  searchKeyword: string = '';
  totalAmountSearch: number | undefined | null;
  createdAt?: string;
  totalAmount?: number;
  private filterSubject = new Subject<void>();
  dueDate: string | undefined;
  dueDateFilter: string | undefined;
  selectedStatus?: 'Active' | 'Closed' | 'Adjusted' | 'Cancelled';
  private invoiceToDeleteId: number | undefined;
  private toastr: any;

  constructor(private invoiceService: InvoiceService, private route: Router) {}

  ngOnInit(): void {
    // Set up debounce for other filters (e.g., dueDateFilter, selectedStatus) if needed
    this.filterSubject.pipe(debounceTime(50)).subscribe(() => {
      this.loadInvoices();
    });
    this.loadInvoices(); // Initial load with no filter
  }

  onTotalAmountChange(value: number | undefined | null): void {
    this.totalAmountSearch = value ?? undefined; // Convert null to undefined
    console.log('Total Amount Changed to:', this.totalAmountSearch); // Debugging
    this.loadInvoices();
  }

  onDueDateChange(value: string): void {
    this.dueDate = value || undefined;
    if (this.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(this.dueDate)) {
      console.warn('Invalid dueDate format:', this.dueDate);
      this.dueDate = undefined;
    }
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.isLoading = true;
    const filters = {
      invoiceNumber: this.searchKeyword || undefined,
      totalAmount: this.totalAmountSearch ?? undefined,
      dueDate: this.dueDate,
      status: this.selectedStatus,
    };
    this.invoiceService.getInvoicesWithFilters(
      filters.invoiceNumber,
      filters.totalAmount,
      undefined, // issueDate
      undefined, // budgetId
      filters.status,
      undefined, // tax
      filters.dueDate,
      undefined, // createdAt
      undefined, // issuedBy
      undefined, // issuedTo
      undefined, // amount
      undefined, // approvalStatus
      undefined  // projectId
    ).subscribe({
      next: (data) => {
        this.invoices = data;
        this.filteredInvoices = data; // Update the displayed list
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load invoices';
        this.isLoading = false;
        console.error('Error loading invoices:', err);
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
    this.totalAmountSearch = undefined;
    this.dueDateFilter = undefined;
    this.selectedStatus = undefined;
    this.loadInvoices();
  }

  sort(column: SortableColumn): void {
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

  deleteInvoice(invoiceId: number | any): void {
    console.log('Attempting to delete invoice with ID:', invoiceId);
    if (invoiceId) {
      this.invoiceService.deleteInvoice(invoiceId).subscribe({
        next: () => {
          this.toastr.success('Invoice deleted successfully', 'Success', { timeOut: 4000 });
          this.loadInvoices(); // Refresh the list of invoices
        },
        error: (error) => {
          this.toastr.error('Failed to delete invoice', 'Error', { timeOut: 4000 });
          console.error('Error deleting invoice:', error);
        },
      });
    } else {
      console.error('Invoice ID is null or undefined');
    }
  }

  viewDetails(id: number): void {
    this.route.navigate(['/financial/invoice', id]).then(success => {
      if (success) {
        this.loadInvoices();
        console.log('Navigation to invoice details succeeded');
      } else {
        console.log('Navigation to invoice details failed');
      }
    }).catch(error => {
      console.error('Error during navigation to invoice details:', error);
    });
  }
}
