import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from "../../../../services/invoice.service";
import { Invoice } from "../../../../models/invoice";
import { Router } from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon"; // Change Route to Router

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatProgressSpinner,
    MatButton,
    NgIf,
    MatFormField,
    MatSelect,
    MatOption,
    MatInput,
    MatCardContent,
    MatCardTitle,
    MatCard,
    MatIcon,
    MatLabel
  ]
})
export class AddInvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private router: Router, // Inject Router instead of Route
  ) {
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      issueDate: ['', Validators.required],
      budgetId: [0, [Validators.required, Validators.min(1)]],
      status: ['Active', Validators.required],
      tax: [0, [Validators.required, Validators.min(0)]],
      dueDate: ['', Validators.required],
      issued_by: ['', Validators.required],
      issued_to: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      approvalStatus: ['PENDING', Validators.required],
      project_id: [0, Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.invoiceForm.invalid) {
      this.toastr.error('Please fill in all required fields', 'Error');
      return;
    }
    this.loading = true;

    this.invoiceService.createInvoice(this.invoiceForm.value).subscribe({
      next: (invoice: Invoice) => {
        this.loading = false;
        this.toastr.success('Invoice created successfully!', 'Success');
        this.router.navigate(['/financial/invoice']);
        this.invoiceService.notifyInvoiceUpdated();
        this.goBack();
        this.invoiceForm.reset();
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Failed to create invoice', 'Error');
        console.error(err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/financial/invoice']); // Navigate back to the invoice list
  }
}
