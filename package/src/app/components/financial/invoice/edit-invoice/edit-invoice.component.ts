import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {InvoiceService} from "../../../../services/invoice.service";
import {MatButton} from "@angular/material/button";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatLabel} from "@angular/material/form-field";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";


@Component({
  selector: 'app-edit-invoice',
  templateUrl: './edit-invoice.component.html',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatDatepickerToggle,
    MatInput,
    MatDatepickerInput,
    MatDatepicker,
    MatFormField,
    MatSelect,
    MatOption,
    MatCard,
    MatLabel,
    MatProgressSpinner,
    MatCardTitle,
    MatCardContent,
    NgIf,
    MatIcon
  ],
  styleUrl:'./edit-invoice.component.scss',
})
export class EditInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  invoiceId: number;
  loading: unknown;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      issuedBy: ['', Validators.required],
      issuedTo: ['', Validators.required],
      issueDate: ['', Validators.required],
      tax: [0, [Validators.required, Validators.min(0)]],
      createdAt: ['',Validators.required],
    });
  }

  ngOnInit(): void {
    this.invoiceId = +this.route.snapshot.paramMap.get('id')!;
    this.invoiceService.getInvoiceById(this.invoiceId).subscribe({
      next: (invoice) => {
        this.invoiceForm.patchValue({
          invoiceNumber: invoice.invoiceNumber,
          totalAmount: invoice.totalAmount,
          status: invoice.status,
          dueDate: invoice.dueDate,
          issuedBy: invoice.issued_by, // Note the underscore
          issuedTo: invoice.issued_to, // Note the underscore
          issueDate: invoice.issueDate,
          tax: invoice.tax,
          createdAt: invoice.created_at
        });
      },
      error: (err) => console.error('Failed to load invoice', err)
    });
  }

  onSubmit(): void {
    if (!this.invoiceId || isNaN(this.invoiceId)) {
      console.error('Cannot update: Invalid invoice ID:', this.invoiceId);
      return;
    }

    if (this.invoiceForm.valid) {
      const formData = this.invoiceForm.value;

      // Log the form data to verify the values before transformation
      console.log('Form data before transformation:', formData);

      // Transform camelCase to snake_case for the backend
      const transformedData = {
        ...formData,
        issued_by: formData.issuedBy || '', // Ensure default value if undefined
        issued_to: formData.issuedTo || '', // Ensure default value if undefined
        created_at: formData.createdAt || '', // Ensure default value if undefined
      };

      // Remove the camelCase properties to avoid sending them to the backend
      delete transformedData.issuedBy;
      delete transformedData.issuedTo;
      delete transformedData.createdAt;

      // Log the transformed data to verify the mapping
      console.log('Transformed data sent to backend:', transformedData);

      this.invoiceService.updateInvoice(this.invoiceId, transformedData).subscribe({
        next: (response) => {
          console.log('Invoice updated successfully:', response);
          this.invoiceService.notifyInvoiceUpdated();
          this.router.navigate(['/financial/invoice'])
            .then(success => {
              if (!success) {
                console.error('Navigation to /financial/invoice failed');
              }
            })
            .catch(error => {
              console.error('Error during navigation:', error);
            });
        },
        error: (err) => {
          console.error('Update failed:', err);
          // Optionally, display an error message to the user
        }
      });
    } else {
      console.warn('Form is invalid, please check the fields:', this.invoiceForm.errors);
    }
  }
  goBack(): void {
    this.router.navigate(['/financial/invoice']); // Navigate back to the invoice list
  }
}
