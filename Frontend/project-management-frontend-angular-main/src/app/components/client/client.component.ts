import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClientResponse } from 'src/app/models/client.response';
import { AuthService } from 'src/app/services/auth.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients: any;
  // loading: boolean = false;
  clientToDeleteId!: number;
  clientToDeleteName!: string;
  searchKeyword: string = '';
  isLoading: boolean = false;
  errorMessage: string | undefined;
  currentPage: number = 1;
  totalPages!: number;
  totalItems!: number;
  perPage: number = 5;

  constructor(private client: ClientService, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getClient();
  }

  // getClient(){
  //   // this.loading = true;
  //   return this.client.getClients(this.searchKeyword).subscribe((res: any) =>{
  //     console.log(res);
  //     this.clients = res.clients;
  //     // this.loading = false;
  //   })
  // }

  // getCategory(){
  //   this.isLoading = true;
  //   return this.category.getCategorys(this.searchKeyword).subscribe(
  //     (res: any) => {
  //       this.categories = res.categories;
  //       this.errorMessage = undefined;
  //       this.isLoading = false;
  //     },
  //     error => {
  //       if (error.status === 404) {
  //         this.errorMessage = error.error.message;
  //         this.categories = []; 
  //       } else {
  //         this.errorMessage = 'An error occurred while fetching tasks.';
  //       }
  //       this.isLoading = false;
  //     }
  //   )
  // }

  getClient(){
    this.isLoading = true;
    return this.client.Client(this.searchKeyword, this.currentPage, 5).subscribe(
      (res: any) => {
        this.clients = res.clients.data;
        this.totalPages = res.clients.last_page;
        this.totalItems = res.clients.total;
        this.errorMessage = undefined;
        this.isLoading = false;
      },
      error => {
        if (error.status === 404) {
          this.errorMessage = error.error.message;
          this.clients= []; 
        } else {
          this.errorMessage = 'An error occurred while fetching tasks.';
        }
        this.isLoading = false;
      }
    )
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  search() {
    this.getClient();
  }

  setClientToDelete(clientId: number, companyName: string) {
    this.clientToDeleteId = clientId;
    this.clientToDeleteName = companyName; // Assign companyName instead of client.name
  } 

  deleteClient(){
    if (this.authService.hasPermission('client-delete')){
      this.client.deleteClient(this.clientToDeleteId).subscribe(
        (res) => {
          if (res.status === 200) {
            this.toastr.success(res.message, 'Success', {
              timeOut: 2000,
              progressBar: true
            });
            this.getClient();
            document.getElementById('exampleModal-2')?.click();
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
      this.toastr.error('You do not have permission to delete a client.', 'Unauthorized', {
        timeOut: 4000,
        progressBar: true
      });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getClient();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getClient();
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

}
