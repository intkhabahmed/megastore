import { Injectable } from '@angular/core'
import { CartItem } from '../models/cart-item'
import { OrderSummary } from '../models/order-summary'
import { DataService } from '../services/data.service'

@Injectable({
    providedIn: "root"
})
export class Utility {
    getFormattedWeight(weight) {
        if (weight < 1) {
            return `${weight * 1000} G`
        }
        if (weight == 1) {
            return `${weight} KG`
        }
        return `${weight} KGs`
    }

    decreaseProductQuantity(item: CartItem, orderSummary: OrderSummary, dataService: DataService) {
        if (item.noOfItems > 0) {
            item.noOfItems--
            orderSummary.cartItems.set(item.product._id, item)
            orderSummary.productNetWeight -= item.product.weight
            orderSummary.totalProductCost -= item.product.price
            orderSummary.grandTotal -= item.product.price
            if (item.noOfItems == 0) {
                orderSummary.cartItems.delete(item.product._id)
            }
            dataService.changeOrderDetails(orderSummary)
        }
    }

    increaseProductQuantity(item: CartItem, orderSummary: OrderSummary, dataService: DataService) {
        if (item.product.quantity > item.noOfItems) {
            item.noOfItems++
            item.itemsWeight += item.product.weight
            item.itemsCost += item.product.price
            orderSummary.productNetWeight += item.product.weight
            orderSummary.totalProductCost += item.product.price
            orderSummary.grandTotal += item.product.price
            dataService.changeOrderDetails(orderSummary)
        } else {
            alert(`Only ${item.product.quantity} available`)
        }
    }

    states = [
        " Andhra Pradesh(AP)",
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