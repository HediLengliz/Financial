import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { RouterLink } from '@angular/router';
import { Payment } from '../../models/payment';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatCardModule,
    MatButtonModule,
    RouterLink,

  ],
  styleUrls: ['./payment.component.scss'],
  providers: [DatePipe]
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentMethods = ['PAYPAL', 'CARD'];
  paymentStatuses = ['Pending', 'Completed', 'Failed'];
  showCardDetails = false;
  isLoading = false;
  savedPaymentMethods: Partial<Payment>[] = [];
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  searchKeyword: string = '';
  selectedStatus: string = '';
  errorMessage?: string;
  showForm = false;

  // For add/edit form
  newPayment: Payment = {
    email: '',
    amount: 0,
    paymentMethod: 'PAYPAL',
    description: '',
    savePaymentInfo: false,
    status: 'Pending'
  };

  editingPaymentId?: number;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.paymentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(0)]],
      paymentMethod: ['PAYPAL', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      savePaymentInfo: [false],
      description: ['', Validators.required],
      // Frontend-only fields
      status: ['Pending'],
      expenseId: [''],
      invoiceId: [''],
      reference: ['']
    });
  }

  ngOnInit(): void {
    this.loadPayments();
    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.showCardDetails = method === 'CARD';

      if (this.showCardDetails) {
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required, Validators.pattern('^[0-9]{16}$')]);
        this.paymentForm.get('expiryDate')?.setValidators([Validators.required, Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$')]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required, Validators.pattern('^[0-9]{3,4}$')]);
      } else {
        this.paymentForm.get('cardNumber')?.clearValidators();
        this.paymentForm.get('expiryDate')?.clearValidators();
        this.paymentForm.get('cvv')?.clearValidators();
      }

      this.paymentForm.get('cardNumber')?.updateValueAndValidity();
      this.paymentForm.get('expiryDate')?.updateValueAndValidity();
      this.paymentForm.get('cvv')?.updateValueAndValidity();
    });

    this.loadSavedPaymentMethods();

    // Subscribe to payment updates
    this.paymentService.paymentUpdated$.subscribe(() => {
      this.loadPayments();
    });
  }

  loadPayments(): void {
    this.isLoading = true;
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.filteredPayments = [...this.payments];
        this.isLoading = false;
      },
      error: (error) => {
        this.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any): void {
    if (error.status === 404) {
      this.errorMessage = 'No payments found';
      this.payments = [];
      this.filteredPayments = [];
    } else {
      this.errorMessage = 'An error occurred while fetching payments';
      this.toastr.error('Failed to load payments', 'Error', { timeOut: 4000, progressBar: true });
    }
  }

  loadSavedPaymentMethods(): void {
    // Load saved payment methods from local storage
    const savedMethods = localStorage.getItem('savedPaymentMethods');
    if (savedMethods) {
      this.savedPaymentMethods = JSON.parse(savedMethods);
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      const paymentData: Payment = this.preparePaymentData();

      // Store user email for notifications
      localStorage.setItem('userEmail', paymentData.email);

      if (this.editingPaymentId) {
        // Update existing payment
        this.paymentService.updatePayment(this.editingPaymentId, paymentData).subscribe({
          next: (response) => {
            this.handleSubmitSuccess('Payment updated successfully!');
          },
          error: (error) => {
            this.handleSubmitError(error, 'Update failed');
          }
        });
      } else {
        // Show processing message
        this.toastr.info('Processing payment...', 'Please wait', { timeOut: 3000, progressBar: true });

        // Create new payment
        this.paymentService.processPayment(paymentData).subscribe({
          next: (response) => {
            console.log('Payment processing successful:', response);
            this.handleSubmitSuccess('Payment successful!');
          },
          error: (error) => {
            // The payment service now returns a structured error with message
            this.handleSubmitError(error, 'Payment failed');
          }
        });
      }
    }
  }

  // Prepare payment data for backend
  private preparePaymentData(): Payment {
    const formValue = this.paymentForm.value;

    // Create payment object with required backend fields
    const payment: Payment = {
      email: formValue.email,
      amount: formValue.amount,
      paymentMethod: formValue.paymentMethod,
      description: formValue.description,
      savePaymentInfo: formValue.savePaymentInfo
    };

    // Add card details if payment method is CARD
    if (formValue.paymentMethod === 'CARD') {
      payment.cardNumber = formValue.cardNumber;
      payment.expiryDate = formValue.expiryDate;
      payment.cvv = formValue.cvv;
    }

    // Add frontend-specific fields
    payment.status = formValue.status;

    if (formValue.expenseId) payment.expenseId = formValue.expenseId;
    if (formValue.invoiceId) payment.invoiceId = formValue.invoiceId;
    if (formValue.reference) payment.reference = formValue.reference;

    return payment;
  }

  private handleSubmitSuccess(message: string): void {
    this.isLoading = false;
    this.toastr.success(message, 'Success', { timeOut: 3000, progressBar: true });

    if (this.paymentForm.value.savePaymentInfo) {
      this.savePaymentMethod(this.paymentForm.value);
    }

    this.resetForm();
    this.loadPayments();
    this.paymentService.notifyPaymentUpdate();
  }

  private handleSubmitError(error: any, defaultMessage: string): void {
    this.isLoading = false;

    // Use the error message from the payment service if available
    const errorMsg = error.message || defaultMessage;

    // Log error details for debugging
    console.error('Payment submission error:', errorMsg, error);

    // Display error to user
    this.toastr.error(errorMsg, 'Error', {
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      enableHtml: true
    });

    // If there's a network issue, show additional guidance
    if (error.status === 0 || error.status === 504) {
      this.toastr.info(
        'Please try again later or contact support if the problem persists.',
        'Connection Issue',
        { timeOut: 8000, progressBar: true }
      );
    }
  }

  createNewPayment(): void {
    this.resetForm();
    this.showForm = true;
    this.editingPaymentId = undefined;
  }

  editPayment(payment: Payment): void {
    this.editingPaymentId = payment.id;
    this.paymentForm.patchValue({
      email: payment.email,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      description: payment.description,
      savePaymentInfo: payment.savePaymentInfo || false,
      status: payment.status || 'Pending',
      expenseId: payment.expenseId || '',
      invoiceId: payment.invoiceId || '',
      reference: payment.reference || ''
    });

    // Show card details if payment method is Card
    if (payment.paymentMethod === 'CARD' && payment.cardNumber) {
      this.showCardDetails = true;
      this.paymentForm.patchValue({
        cardNumber: payment.cardNumber,
        expiryDate: payment.expiryDate,
        cvv: payment.cvv
      });
    }

    this.showForm = true;
  }

  deletePayment(paymentId?: number): void {
    if (!paymentId) return;

    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(paymentId).subscribe({
        next: () => {
          this.toastr.success('Payment deleted successfully!', 'Success', { timeOut: 3000, progressBar: true });
          this.loadPayments();
        },
        error: (error) => {
          this.toastr.error('Failed to delete payment', 'Error', { timeOut: 4000, progressBar: true });
        }
      });
    }
  }

  resetForm(): void {
    this.paymentForm.reset({
      status: 'Pending',
      savePaymentInfo: false
    });
    this.showCardDetails = false;
  }

  cancelEdit(): void {
    this.resetForm();
    this.showForm = false;
    this.editingPaymentId = undefined;
  }

  savePaymentMethod(paymentData: Payment): void {
    const savedMethod: Partial<Payment> = {
      email: paymentData.email,
      paymentMethod: paymentData.paymentMethod,
      cardNumber: paymentData.cardNumber ? '****' + paymentData.cardNumber.slice(-4) : undefined,
      expiryDate: paymentData.expiryDate
    };

    this.savedPaymentMethods.push(savedMethod);
    localStorage.setItem('savedPaymentMethods', JSON.stringify(this.savedPaymentMethods));
  }

  useSavedMethod(method: Partial<Payment>): void {
    this.paymentForm.patchValue({
      email: method.email,
      paymentMethod: method.paymentMethod
    });
  }

  search(): void {
    if (!this.searchKeyword && !this.selectedStatus) {
      this.filteredPayments = [...this.payments];
      return;
    }

    this.filteredPayments = this.payments.filter(payment => {
      const matchesKeyword = !this.searchKeyword ||
        payment.description.toLowerCase().includes(this.searchKeyword.toLowerCase()) ||
        payment.email.toLowerCase().includes(this.searchKeyword.toLowerCase());

      const matchesStatus = !this.selectedStatus || payment.status === this.selectedStatus;

      return matchesKeyword && matchesStatus;
    });
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.selectedStatus = '';
    this.filteredPayments = [...this.payments];
  }
}
