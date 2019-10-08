import { AlertService } from './../services/alert.service';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { CartItem } from '../models/cart-item';
import { Order } from '../models/order';
import { OrderSummary } from '../models/order-summary';
import { DataService } from '../services/data.service';
import { GrossWeight } from './../models/gross-weight';
import { ApiService } from './../services/api.service';

@Injectable({
    providedIn: "root"
})
export class Utility {
    orderSummary: OrderSummary
    order: Order
    grossWeights: GrossWeight[]
    constructor(private dataService: DataService, private api: ApiService, private alertService: AlertService) {
        this.dataService.orderSummary.subscribe(summary => this.orderSummary = summary)
        dataService.order.subscribe(order => this.order = order)
        this.api.getGrossWeights().subscribe(weights => this.grossWeights = weights)
    }
    getFormattedWeight(weight) {
        if (weight < 1000) {
            return `${weight} Gms`
        }
        if (weight == 1000) {
            return `${weight / 1000} KG`
        }
        return `${weight / 1000} KGs`
    }

    decreaseProductQuantity(item: CartItem) {
        if (item.noOfItems > 0) {
            item.noOfItems--
            this.orderSummary.cartItems.set(item.product._id, item)
            this.orderSummary.productNetWeight -= item.product.weight[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.totalProductCost -= item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal -= item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            if (item.noOfItems == 0) {
                this.orderSummary.cartItems.delete(item.product._id)
            }
            if (this.orderSummary.cartItems.size == 0) {
                this.dataService.changeOrderDetails(new OrderSummary())
            } else {
                this.dataService.changeOrderDetails(this.orderSummary)
            }
        }
    }

    increaseProductQuantity(item: CartItem) {
        if (item.product.quantity[item.product.selectedIndex][item.product.subIndex] > item.noOfItems) {
            item.noOfItems++
            item.itemsWeight += item.product.weight[item.product.selectedIndex][item.product.subIndex]
            item.itemsCost += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.productNetWeight += item.product.weight[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.totalProductCost += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            this.dataService.changeOrderDetails(this.orderSummary)
        } else {
            this.alertService.error(`Only ${item.product.quantity[item.product.selectedIndex]} available`, true)
        }
    }

    addProductToCart(product: Product) {
        var item = new CartItem();
        item.product = product
        item.noOfItems = 1
        item.itemsWeight = product.weight[product.selectedIndex][product.subIndex]
        item.itemsCost = product.price[product.selectedIndex][product.subIndex]
        this.orderSummary.cartItems.set(product._id, item)
        this.orderSummary.productNetWeight += product.weight[product.selectedIndex][product.subIndex]
        this.orderSummary.totalProductCost += product.price[product.selectedIndex][product.subIndex]
        this.orderSummary.shippingCost = 0
        this.calculateGrossWeight(this.orderSummary.productNetWeight)
        this.dataService.changeOrderDetails(this.orderSummary);
    }

    removeItemFromCart(product: Product) {
        var cartItem = this.orderSummary.cartItems.get(product._id)
        this.orderSummary.productNetWeight -= product.weight[product.selectedIndex][product.subIndex]
        this.orderSummary.totalProductCost -= cartItem.itemsCost
        this.orderSummary.grandTotal -= cartItem.itemsCost * cartItem.noOfItems
        this.calculateGrossWeight(this.orderSummary.productNetWeight)
        this.orderSummary.shippingCost = 0
        this.orderSummary.cartItems.delete(product._id)
        if (this.orderSummary.cartItems.size == 0) {
            this.dataService.changeOrderDetails(new OrderSummary())
        } else {
            this.dataService.changeOrderDetails(this.orderSummary)
        }
    }

    updateCartProduct(product: Product) {
        var item = this.orderSummary.cartItems.get(product._id)
        item.itemsWeight = item.product.weight[item.product.selectedIndex][item.product.subIndex] * item.noOfItems
        item.itemsCost = item.product.price[item.product.selectedIndex][item.product.subIndex] * item.noOfItems
        this.orderSummary.cartItems.set(product._id, item)
        this.orderSummary.productNetWeight = 0
        this.orderSummary.totalProductCost = 0
        //update for new price and weight
        this.orderSummary.cartItems.forEach(item => {
            this.orderSummary.productNetWeight += item.itemsWeight
            this.orderSummary.totalProductCost += item.itemsCost
        })
        this.orderSummary.shippingCost = 0
        this.calculateGrossWeight(this.orderSummary.productNetWeight)
        this.dataService.changeOrderDetails(this.orderSummary);
    }

    checkForOutOfStock(product: Product, index = -1) {
        if (index !== -1) {
            return product.quantity[index].filter(q => q != 0).length == 0
        }
        return product.quantity.filter(q => q.filter(q1 => q1 != 0)).length == 0
    }

    getMinPrice(prices: number[][]) {
        return Math.min(...[].concat(...prices))
    }

    calculateGrossWeight(netWeight) {
        this.grossWeights.forEach((weight: GrossWeight) => {
            if (netWeight >= weight.minWeight && netWeight <= weight.maxWeight) {
                this.orderSummary.productGrossWeight = netWeight + weight.toBeAdded
            }
        })
    }

    prettyPrintCartItems(cartItems: Map<string, CartItem>) {

    }

    states = [
        "Andhra Pradesh(AP)",
        "Arunachal Pradesh(AR)",
        "Assam(AS)",
        "Bihar(BR)",
        "Chhattisgarh(CG)",
        "Goa(GA)",
        "Gujarat(GJ)",
        "Haryana(HR)",
        "Himachal Pradesh(HP)",
        "Jammu and Kashmir(JK)",
        "Jharkhand(JH)",
        "Karnataka(KA)",
        "Kerala(KL)",
        "Madhya Pradesh(MP)",
        "Maharashtra(MH)",
        "Manipur(MN)",
        "Meghalaya(ML)",
        "Mizoram(MZ)",
        "Nagaland(NL)",
        "Odisha(OR)",
        "Punjab(PB)",
        "Rajasthan(RJ)",
        "Sikkim(SK)",
        "Tamil Nadu(TN)",
        "Telangana(TS)",
        "Tripura(TR)",
        "Uttar Pradesh(UP)",
        "Uttarakhand(UK)",
        "West Bengal(WB)",
        "Andaman and Nicobar Islands(AN)",
        "Chandigarh (CH)",
        "Dadra and Nagar Haveli (DN)",
        "Daman and Diu (DD)",
        "Ladakh",
        "Lakshadweep (LD)",
        "National Capital Territory of Delhi (DL)",
        "Pondicherry (PY)",
    ]
}