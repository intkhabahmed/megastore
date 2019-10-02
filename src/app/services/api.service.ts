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

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(apiUrl)
      .pipe(
        tap(Products => console.log('fetched Products')),
        catchError(this.handleError('getProducts', []))
      );
  }

  getProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => console.log(`fetched Product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(apiUrl, product, httpOptions).pipe(
      tap((art: Product) => console.log(`added Product w/ id=${art._id}`)),
      catchError(this.handleError<Product>('addProduct'))
    );
  }

  updateProduct(id: any, product: Product): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, product, httpOptions).pipe(
      tap(_ => console.log(`updated Product id=${id}`)),
      catchError(this.handleError<any>('updateProduct'))
    );
  }

  deleteProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Product>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted Product id=${id}`)),
      catchError(this.handleError<Product>('deleteProduct'))
    );
  }

  //User Methods

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}/users/all`).pipe(
      tap(users => console.log('fetched users')),
      catchError(this.handleError('getRegisteredUsers', []))
    )
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users/register`, user, httpOptions).pipe(
      tap((user: User) => console.log('Registered User')),
      catchError(this.handleError<User>('register')))
  }

  deleteUser(id: number) {
    return this.http.delete<User>(`${apiUrl}/users/${id}`).pipe(
      tap((user: User) => console.log('deleted user')),
      catchError(this.handleError<User>('deleteUser')))
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users/authenticate`, { email, password }, httpOptions).pipe(
      tap((user: User) => console.log('User Authenticated')),
      catchError(this.handleError<User>('login')))
  }

  // Shipping Rate methods
  getShippingRates(): Observable<ShippingRate[]> {
    return this.http.get<ShippingRate[]>(`${apiUrl}/shippingRates/all`).pipe(
      tap(shippingRates => console.log('fetched shippingRates')),
      catchError(this.handleError('getShippingRates', []))
    )
  }

  getShippingRatesByCourierType(type: any): Observable<ShippingRate[]> {
    return this.http.post<ShippingRate[]>(`${apiUrl}/shippingRates/filter`, type == "" ? {} : { shippingMethod: type }, httpOptions).pipe(
      tap(shippingRates => console.log('fetched shippingRates')),
      catchError(this.handleError('getShippingRates', []))
    )
  }

  insertShippingRate(shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.post(`${apiUrl}/shippingRates`, shippingRate, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log(`added Shipping rate w/ id=${rate._id}`)),
      catchError(this.handleError<ShippingRate>('insertShippingRate'))
    );
  }

  updateShippingRate(id: any, shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.put(`${apiUrl}/shippingRates/${id}`, shippingRate, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log(`updated shipping rate`),
        catchError(this.handleError<ShippingRate>('updateShippingRate')))
    )
  }

  deleteShippingRate(id: any): Observable<ShippingRate> {
    return this.http.delete(`${apiUrl}/shippingRates/${id}`, httpOptions).pipe(
      tap((rate: ShippingRate) => console.log("shipping rate deleted"),
        catchError(this.handleError<ShippingRate>('deleteShippingRate'))
      )
    )
  }

  // Gross Weight methods
  getGrossWeights(): Observable<GrossWeight[]> {
    return this.http.get<GrossWeight[]>(`${apiUrl}/grossWeights/all`).pipe(
      tap(grossWeights => console.log('fetched grossWeights')),
      catchError(this.handleError('getGrossWeights', []))
    )
  }

  insertGrossWeight(grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.post(`${apiUrl}/grossWeights`, grossWeight, httpOptions).pipe(
      tap((weight: GrossWeight) => console.log(`added gross weight w/ id=${weight._id}`)),
      catchError(this.handleError<GrossWeight>('insertGrossWeight'))
    );
  }

  updateGrossWeight(id: any, grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.put(`${apiUrl}/grossWeights/${id}`, grossWeight, httpOptions).pipe(
      tap((rate: GrossWeight) => console.log(`updated gross weight`),
        catchError(this.handleError<GrossWeight>('updateGrossWeight')))
    )
  }

  deleteGrossWeight(id: any): Observable<GrossWeight> {
    return this.http.delete(`${apiUrl}/grossWeights/${id}`, httpOptions).pipe(
      tap((rate: GrossWeight) => console.log("gross weight deleted"),
        catchError(this.handleError<GrossWeight>('deleteGrossWeight'))
      )
    )
  }

  //Product order methods
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/all`).pipe(
      tap(orders => console.log('fetched orders')),
      catchError(this.handleError('getOrders', []))
    )
  }

  getOrdersByUserId(id: any): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/user/${id}`).pipe(
      tap(orders => console.log('fetched orders')),
      catchError(this.handleError('getOrdersByUserId', []))
    )
  }

  insertOrder(order: Order): Observable<Order> {
    return this.http.post(`${apiUrl}/orders`, order, httpOptions).pipe(
      tap((order: Order) => console.log(`added order w/ id=${order._id}`)),
      catchError(this.handleError<Order>('insertOrder'))
    );
  }

  updateOrder(id: any, order: Order): Observable<Order> {
    return this.http.put(`${apiUrl}/orders/${id}`, order, httpOptions).pipe(
      tap((rate: Order) => console.log(`updated order`),
        catchError(this.handleError<Order>('updateOrder')))
    )
  }

  // Message methods
  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${apiUrl}/messages/all`).pipe(
      tap(messages => console.log('fetched messages')),
      catchError(this.handleError('getMessages', []))
    )
  }

  getMessagesByUserId(id: any): Observable<Message> {
    return this.http.get<Message>(`${apiUrl}/messages/user/${id}`).pipe(
      tap(message => console.log('fetched message')),
      catchError(this.handleError<Message>('getMessageByUserId'))
    )
  }

  insertMessage(message: Message): Observable<Message> {
    return this.http.post(`${apiUrl}/messages`, message, httpOptions).pipe(
      tap((message: Message) => console.log(`added message w/ id=${message._id}`)),
      catchError(this.handleError<Message>('insertMessage'))
    );
  }

  updateMessage(id: any, message: Message): Observable<Message> {
    return this.http.put(`${apiUrl}/messages/${id}`, message, httpOptions).pipe(
      tap((rate: Message) => console.log(`updated message`),
        catchError(this.handleError<Message>('updateMessage')))
    )
  }

}
