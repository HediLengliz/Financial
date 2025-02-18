import { Component, OnInit, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employee.response';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: any;
  loading: boolean = false;
  employeeToDeleteId!: number;
  employeeToDeleteName!: string;
  searchKeyword: string = '';
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;
  isLoading: boolean = false;
  sortedColumn: string | null = null;
  sortAscending: boolean = true;
  
  constructor(private employee: EmployeeService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getEmployee();
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  getEmployee(){
    this.isLoading = true;
    return this.employee.Employee(this.searchKeyword, this.currentPage, 5).subscribe((res: any) => {
      console.log(res);
      this.employees = res.users.data;
      this.totalPages = res.users.last_page;
      this.totalItems = res.users.total;
      this.isLoading = false;
    });
  }

  search() {
    this.getEmployee();
  }

  setEmployeeToDelete(employeeId: number, employeeName: string) {
    this.employeeToDeleteId = employeeId;
    this.employeeToDeleteName = employeeName;
  }

  deleteEmployee(){
    if (this.authService.hasPermission('user-delete')) {
      this.employee.deleteEmployee(this.employeeToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getEmployee();
            document.getElementById('exampleModal')?.click();
          } else {
            this.toastr.error(res.message, 'Error', {
              timeOut: 4000,
              progressBar: true
            });
          }
        },
        (error) => {
          console.error('Error:', error);
            this.toastr.error('An error occurred while deleting the feature.', 'Error', {
              timeOut: 4000,
              progressBar: true
          });
        }
      );
    }else {
      // Display error message if user doesn't have permission to delete a role
      this.toastr.error('You do not have permission to delete a user.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getEmployee();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getEmployee();
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }  

  calculateFirstItemIndex(): number {
    return (this.currentPage - 1) * this.perPage + 1;
  }
  
  calculateLastItemIndex(): number {
    const lastItem = this.currentPage * this.perPage;
    return lastItem > this.totalItems ? this.totalItems : lastItem;
  }

  sortBy(column: string): void {
    if (this.sortedColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortedColumn = column;
      this.sortAscending = true;
    }

    this.employees.sort((a: any, b: any) => {
      const aValue = this.getFieldValue(a, column);
      const bValue = this.getFieldValue(b, column);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return this.sortAscending ? aValue - bValue : bValue - aValue;
      }
    });
  }

  private getFieldValue(object: any, field: string): any {
    // Handle nested fields like 'address.city'
    const fields = field.split('.');
    let value = object;

    for (const f of fields) {
      value = value[f];
    }

    return value;
  }

}
