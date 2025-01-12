import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from '../customer.service';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  loading: boolean = false;
  customers: any[] = [];
  filteredCustomers: any[] = []; // Array to hold filtered customers
  searchTerm: string = '';

  constructor(private customerService: CustomerService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  filterCustomers() {
    if (this.searchTerm) {
      this.filteredCustomers = this.customers.filter(customer => 
        customer.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.address.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(this.searchTerm)
      );
    } else {
      this.filteredCustomers = this.customers; // Reset to full list if no search term
    }
  }
  
  loadCustomers() {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
      this.filteredCustomers = data; // Initialize filtered customers
    });
  }

  openDialog(customer?: any): void {
    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      data: customer ? { ...customer } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.customerID) {
          // Update existing customer logic
          this.customerService.updateCustomer(result.customerID, result).subscribe(() => {
            this.loadCustomers();
          });
        } else {
          // Add new customer logic
          this.customerService.addCustomer(result).subscribe(response => {
            const customerId = response.id;
            const customerDetails = {
              customerID: customerId,
              address: result.address,
              phoneNumber: result.phoneNumber,
            };
            this.customerService.addCustomerDetails(customerDetails).subscribe(() => {
              this.loadCustomers();
            });
          });
        }
      }
    });
  }

  deleteCustomer(customerId: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
        this.customerService.deleteCustomer(customerId).subscribe({
            next: () => {
                this.loadCustomers(); // Reload customers after deletion
            },
            error: (err) => {
                console.error('Error deleting customer:', err);
            }
        });
    }
}

}
