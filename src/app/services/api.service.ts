import { Address } from './../models/address';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GrossWeight } from '../models/gross-weight';
import { Message } from '../models/message';
import { Order } from '../models/order';
import { ShippingRate } from '../models/shipping-rate';
import { User } from '../models/user';
import { apiUrl } from './../../environments/environment';
import { Product } from './../models/product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(result as T);
    };
  }

  // Product methods

  getProducts(filter: any = {}): Observable<Product[]> {
    return this.http.post<Product[]>(`${apiUrl}/products`, filter, httpOptions)
      .pipe(
        tap(Products => console.log('fetched Products'))
      );
  }

  getProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => console.log(`fetched Product id=${id}`))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(apiUrl, product, httpOptions).pipe(
      tap((art: Product) => console.log(`added Product w/ id=${art._id}`))
    );
  }

  updateProduct(id: any, product: Product): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => console.log(`updated Product id=${id}`))
    );
  }

  deleteProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Product id=${id}`))
    );
  }

  //User Methods

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}/users/all`).pipe(
      tap(users => console.log('fetched users'))
    )
  }

  getUserById(id: any): Observable<User> {
    return this.http.get<User>(`${apiUrl}/users/${id}`).pipe(
      tap(users => console.log('fetched user'))
    )
  }

  updateUser(id: any, user: User): Observable<User> {
    return this.http.put(`${apiUrl}/users/${id}`, user, httpOptions).pipe(
      tap((user: User) => console.log(`updated user`)))
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users/register`, user, httpOptions).pipe(
      tap((user: User) => console.log('Registered User')))
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${apiUrl}/users/${id}`).pipe(
      tap((user: User) => console.log('deleted user')))
  }

  changePassword(id: any, body: any): Observable<User> {
    return this.http.put<User>(`${apiUrl}/users/changePassword/${id}`, body, httpOptions).pipe(
      tap(user => console.log("Password updated"))
    )
  }

  // Shipping Rate methods

  getShippingRates(type: any): Observable<ShippingRate[]> {
    return this.http.post<ShippingRate[]>(`${apiUrl}/shippingRates/filter`, type == "" ? {} : { shippingMethod: type }, httpOptions).pipe(
      tap(shippingRates => console.log('fetched shippingRates'))
    )
  }

  calculateShippingCharge(filter: any): Observable<ShippingRate> {
    return this.http.post<ShippingRate>(`${apiUrl}/shippingRates/calculate`, filter, httpOptions).pipe(
      tap(shippingRate => console.log('fetched shippingRate'))
    )
  }

  insertShippingRate(shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.post(`${apiUrl}/shippingRates`, shippingRate, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log(`added Shipping rate w/ id=${rate._id}`))
    );
  }

  updateShippingRate(id: any, shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.put(`${apiUrl}/shippingRates/${id}`, shippingRate, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log(`updated shipping rate`))
    )
  }

  deleteShippingRate(id: any): Observable<ShippingRate> {
    return this.http.delete(`${apiUrl}/shippingRates/${id}`, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log("shipping rate deleted")
      )
    )
  }

  // Gross Weight methods
  getGrossWeights(): Observable<GrossWeight[]> {
    return this.http.get<GrossWeight[]>(`${apiUrl}/grossWeights/all`).pipe(
      tap(grossWeights => console.log('fetched grossWeights'))
    )
  }

  insertGrossWeight(grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.post(`${apiUrl}/grossWeights`, grossWeight, httpOptions).pipe(
      tap((weight: GrossWeight) => console.log(`added gross weight w/ id=${weight._id}`))
    );
  }

  updateGrossWeight(id: any, grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.put(`${apiUrl}/grossWeights/${id}`, grossWeight, httpOptions).pipe(
      tap((rate: GrossWeight) => console.log(`updated gross weight`))
    )
  }

  deleteGrossWeight(id: any): Observable<GrossWeight> {
    return this.http.delete(`${apiUrl}/grossWeights/${id}`, httpOptions).pipe(
      tap((rate: GrossWeight) => console.log("gross weight deleted")
      )
    )
  }

  //Product order methods
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/all`).pipe(
      tap(orders => console.log('fetched orders'))
    )
  }

  getOrdersByUserId(id: any): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/user/${id}`).pipe(
      tap(orders => console.log('fetched orders'))
    )
  }

  insertOrder(order: Order): Observable<Order> {
    return this.http.post(`${apiUrl}/orders`, order, httpOptions).pipe(
      tap((order: Order) => console.log(`added order w/ id=${order._id}`))
    );
  }

  updateOrder(id: any, order: Order): Observable<Order> {
    return this.http.put(`${apiUrl}/orders/${id}`, order, httpOptions).pipe(
      tap((rate: Order) => console.log(`updated order`))
    )
  }

  // Message methods
  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${apiUrl}/messages/all`).pipe(
      tap(messages => console.log('fetched messages'))
    )
  }

  getMessagesByUserId(id: any): Observable<Message[]> {
    return this.http.get<Message[]>(`${apiUrl}/messages/user/${id}`).pipe(
      tap(message => console.log('fetched messages'))
    )
  }

  insertMessage(message: Message): Observable<Message> {
    return this.http.post(`${apiUrl}/messages`, message, httpOptions).pipe(
      tap((message: Message) => console.log(`added message w/ id=${message._id}`))
    )
  }

  updateMessage(id: any, message: Message): Observable<Message> {
    return this.http.put(`${apiUrl}/messages/${id}`, message, httpOptions).pipe(
      tap((rate: Message) => console.log(`updated message`))
    )
  }

  //Address methods

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${apiUrl}/addresses/all`).pipe(
      tap(addresses => console.log('fetched addresses'))
    )
  }

  insertAddress(address: Address): Observable<Address> {
    return this.http.post(`${apiUrl}/addresses`, address, httpOptions).pipe(
      tap((address: Address) => console.log(`added address w/ id=${address._id}`))
    );
  }

  updateAddress(id: any, address: Address): Observable<Address> {
    return this.http.put(`${apiUrl}/addresses/${id}`, address, httpOptions).pipe(
      tap((rate: Address) => console.log(`updated gross weight`))
    )
  }

  deleteAddress(id: any): Observable<Address> {
    return this.http.delete(`${apiUrl}/addresses/${id}`, httpOptions).pipe(
      tap((address: Address) => console.log("address deleted")
      )
    )
  }

  // Category methods
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/categories/all`).pipe(
      tap(categories => console.log('fetched categories'))
    )
  }

  insertCategory(category: any): Observable<GrossWeight> {
    return this.http.post(`${apiUrl}/categories`, category, httpOptions).pipe(
      tap((category: any) => console.log(`added category with id=${category._id}`))
    );
  }

  updateCategory(id: any, category: any): Observable<GrossWeight> {
    return this.http.put(`${apiUrl}/categories/${id}`, category, httpOptions).pipe(
      tap((category: any) => console.log(`updated category`))
    )
  }

  deleteCategory(id: any): Observable<GrossWeight> {
    return this.http.delete(`${apiUrl}/categories/${id}`, httpOptions).pipe(
      tap((category: any) => console.log("category deleted")
      )
    )
  }

}
