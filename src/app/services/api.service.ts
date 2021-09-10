import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrossWeight } from '../models/gross-weight';
import { Message } from '../models/message';
import { Order } from '../models/order';
import { ShippingRate } from '../models/shipping-rate';
import { User } from '../models/user';
import { apiUrl } from './../../environments/environment';
import { Address } from './../models/address';
import { Product } from './../models/product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // Product methods

  getProducts(filter: any = {}): Observable<Product[]> {
    return this.http.post<Product[]>(`${apiUrl}/products`, filter, httpOptions)
  }

  getProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Product>(url)
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(apiUrl, product, httpOptions)
  }

  updateProduct(id: any, product: Product): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, product, httpOptions)
  }

  deleteProduct(id: any): Observable<Product> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Product>(url, httpOptions)
  }

  //User Methods

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiUrl}/users/all`)
  }

  getUserById(): Observable<User> {
    return this.http.get<User>(`${apiUrl}/users/current`)
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${apiUrl}/users/current`, user, httpOptions)
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users/register`, user, httpOptions)
  }

  deleteUser() {
    return this.http.delete<User>(`${apiUrl}/users/current`)
  }

  changePassword(body: any): Observable<User> {
    return this.http.put<User>(`${apiUrl}/users/changePassword`, body, httpOptions)
  }

  resetPassword(email: string): Observable<User> {
    return this.http.post<User>(`${apiUrl}/users/resetPassword`, { email }, httpOptions)
  }

  createNewPassword(body: any): Observable<User> {
    return this.http.put<User>(`${apiUrl}/users/createNewPassword`, body, httpOptions)
  }

  // Shipping Rate methods

  getShippingRates(type: any): Observable<ShippingRate[]> {
    return this.http.post<ShippingRate[]>(`${apiUrl}/shippingRates/filter`, type == "" ? {} : { shippingMethod: type }, httpOptions)
  }

  calculateShippingCharge(filter: any): Observable<ShippingRate> {
    return this.http.post<ShippingRate>(`${apiUrl}/shippingRates/calculate`, filter, httpOptions)
  }

  insertShippingRate(shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.post<ShippingRate>(`${apiUrl}/shippingRates`, shippingRate, httpOptions)
  }

  updateShippingRate(id: any, shippingRate: ShippingRate): Observable<ShippingRate> {
    return this.http.put<ShippingRate>(`${apiUrl}/shippingRates/${id}`, shippingRate, httpOptions)
  }

  deleteShippingRate(id: any): Observable<ShippingRate> {
    return this.http.delete<ShippingRate>(`${apiUrl}/shippingRates/${id}`, httpOptions)
  }

  // Gross Weight methods
  getGrossWeights(): Observable<GrossWeight[]> {
    return this.http.get<GrossWeight[]>(`${apiUrl}/grossWeights/all`)
  }

  insertGrossWeight(grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.post<GrossWeight>(`${apiUrl}/grossWeights`, grossWeight, httpOptions)
  }

  updateGrossWeight(id: any, grossWeight: GrossWeight): Observable<GrossWeight> {
    return this.http.put<GrossWeight>(`${apiUrl}/grossWeights/${id}`, grossWeight, httpOptions)
  }

  deleteGrossWeight(id: any): Observable<GrossWeight> {
    return this.http.delete<GrossWeight>(`${apiUrl}/grossWeights/${id}`, httpOptions)
  }

  //Product order methods
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/all`)
  }

  getOrdersByUserId(id: any): Observable<Order[]> {
    return this.http.get<Order[]>(`${apiUrl}/orders/user/${id}`)
  }

  insertOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${apiUrl}/orders`, order, httpOptions)
  }

  updateOrder(id: any, order: Order): Observable<Order> {
    return this.http.put<Order>(`${apiUrl}/orders/${id}`, order, httpOptions)
  }

  // Message methods
  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${apiUrl}/messages/all`)
  }

  getMessagesByUserId(id: any): Observable<Message[]> {
    return this.http.get<Message[]>(`${apiUrl}/messages/user/${id}`)
  }

  insertMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${apiUrl}/messages`, message, httpOptions)
  }

  updateMessage(id: any, message: Message): Observable<Message> {
    return this.http.put<Message>(`${apiUrl}/messages/${id}`, message, httpOptions)
  }

  deleteMessage(id: any): Observable<Message> {
    return this.http.delete<Message>(`${apiUrl}/messages/${id}`, httpOptions)
  }

  //Address methods

  insertAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(`${apiUrl}/addresses`, address, httpOptions)
  }

  updateAddress(id: any, address: Address): Observable<Address> {
    return this.http.put<Address>(`${apiUrl}/addresses/${id}`, address, httpOptions)
  }

  deleteAddress(id: any): Observable<Address> {
    return this.http.delete<Address>(`${apiUrl}/addresses/${id}`, httpOptions)
  }

  // Category methods
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/categories/all`)
  }

  insertCategory(category: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/categories`, category, httpOptions)
  }

  updateCategory(id: any, category: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}/categories/${id}`, category, httpOptions)
  }

  deleteCategory(id: any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/categories/${id}`, httpOptions)
  }

  // Banner methods
  getBanners(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/banners/all`)
  }

  insertBanner(banner: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/banners`, banner, httpOptions)
  }

  updateBanner(id: any, banner: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}/banners/${id}`, banner, httpOptions)
  }

  deleteBanner(id: any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/banners/${id}`, httpOptions)
  }

  // New Arrival methods
  getNewArrivals(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/newArrivals/all`)
  }

  insertNewArrival(newArrival: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/newArrivals`, newArrival, httpOptions)
  }

  updateNewArrival(id: any, newArrival: any): Observable<any> {
    return this.http.put<any>(`${apiUrl}/newArrivals/${id}`, newArrival, httpOptions)
  }

  deleteNewArrival(id: any): Observable<any> {
    return this.http.delete<any>(`${apiUrl}/newArrivals/${id}`, httpOptions)
  }

  // Payment Gateway methods
  handlePaymentRequest(body: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/ccavRequestHandler`, body, httpOptions)
  }

  handlePaymentResponse(body: any) {
    this.http.post<any>(`${apiUrl}/ccavResponseHandler`, body, httpOptions)
  }

  //Payments methods
  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${apiUrl}/payments/all`, httpOptions)
  }

  getPaymentForUserByOrderId(orderId: any): Observable<any> {
    return this.http.post<any>(`${apiUrl}/payments/order`, orderId, httpOptions)
  }

}
