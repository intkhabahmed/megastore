import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Order } from '../models/order';
import { OrderSummary } from '../models/order-summary';
import { DataService } from '../services/data.service';
import { CartItem } from './../models/cart-item';
import { GrossWeight } from './../models/gross-weight';
import { AlertService } from './../services/alert.service';
import { ApiService } from './../services/api.service';
import { JsonUtils } from './json-utils';

@Injectable({
    providedIn: "root"
})
export class Utility {
    orderSummary: OrderSummary
    order: Order
    grossWeights: GrossWeight[]
    constructor(
        private dataService: DataService, 
        private api: ApiService, 
        private alertService: AlertService,
        private jsonUtils: JsonUtils
    ) {
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
            item.itemsWeight -= item.product.weight[item.product.selectedIndex][item.product.subIndex]
            item.itemsCost -= item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight -= item.product.weight[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.totalProductCost -= item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal -= item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal -= this.orderSummary.shippingCost
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            if (item.noOfItems == 0) {
                this.orderSummary.cartItems.delete(item.id)
            }
            if (this.orderSummary.cartItems.size == 0) {
                this.dataService.changeOrderDetails(new OrderSummary())
            } else {
                this.dataService.changeOrderDetails(this.orderSummary)
            }
        }
    }

    increaseProductQuantity(item: CartItem) {
        if (item.product.quantity[item.product.selectedIndex][item.product.subIndex] > item.noOfItems && item.noOfItems < 100) {
            item.noOfItems++
            item.itemsWeight += item.product.weight[item.product.selectedIndex][item.product.subIndex]
            item.itemsCost += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight += item.product.weight[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.totalProductCost += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.grandTotal -= this.orderSummary.shippingCost
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            this.dataService.changeOrderDetails(this.orderSummary)
        } else {
            if (item.noOfItems == 100 && item.product.quantity[item.product.selectedIndex][item.product.subIndex] > item.noOfItems) {
                this.alertService.error(`You can buy Only 100 items at a time of same kind`, true)
                return
            }
            this.alertService.error(`Only ${item.product.quantity[item.product.selectedIndex][item.product.subIndex]} available`, true)
        }
    }

    addItemToCart(item: CartItem) {
        var sameItem = this.findSameItemInCart(item.product)
        if (sameItem) {
            sameItem.noOfItems += item.noOfItems
            this.alertService.success(`Same product already added, increased item's quantity by ${item.noOfItems}`)
            this.increaseProductQuantity(sameItem)
        } else {
            var product = item.product
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight += product.weight[product.selectedIndex][product.subIndex]
            this.orderSummary.totalProductCost += product.price[product.selectedIndex][product.subIndex]
            this.orderSummary.grandTotal += item.product.price[item.product.selectedIndex][item.product.subIndex]
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            this.dataService.changeOrderDetails(this.orderSummary);
            this.alertService.success(`Item added to cart`, true)
            return item.id
        }
    }

    removeItemFromCart(item: CartItem) {
        this.orderSummary.productNetWeight -= item.itemsWeight
        this.orderSummary.totalProductCost -= item.itemsCost
        this.orderSummary.grandTotal -= item.itemsCost
        this.calculateGrossWeight(this.orderSummary.productNetWeight)
        this.orderSummary.shippingCost = 0
        this.orderSummary.cartItems.delete(item.id)
        if (this.orderSummary.cartItems.size == 0) {
            this.dataService.changeOrderDetails(new OrderSummary())
            this.dataService.changeOrder(new Order())
        } else {
            this.dataService.changeOrderDetails(this.orderSummary)
        }
    }

    updateCartProduct(item: CartItem) {
        item.itemsWeight = item.product.weight[item.product.selectedIndex][item.product.subIndex] * item.noOfItems
        item.itemsCost = item.product.price[item.product.selectedIndex][item.product.subIndex] * item.noOfItems
        this.orderSummary.cartItems.set(item.id, item)
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

    findSameItemInCart(product: Product): CartItem {
        var sameItem = undefined
        this.orderSummary.cartItems.forEach(item => {
            if (product._id === item.product._id && product.selectedIndex === item.product.selectedIndex && product.subIndex === item.product.subIndex) {
                sameItem = item
            }
        })
        return sameItem
    }

    generateShortId(): string {
        return Math.random().toString(10).substring(2, 7)
    }

    clone(obj: any): any {
        return this.jsonUtils.parseJson(this.jsonUtils.getJsonString(obj))
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
