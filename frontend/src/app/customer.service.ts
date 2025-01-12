import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:3000/customers';

  constructor(private http: HttpClient) {}

  getCustomers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
}


addCustomer(customer: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, customer); // apiUrl should be 'http://localhost:3000/customers'
}


addCustomerDetails(customerDetails: any): Observable<any> {
  return this.http.post<any>('http://localhost:3000/customer_details', customerDetails);
}



  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer);
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${customerId}`);
}

}
