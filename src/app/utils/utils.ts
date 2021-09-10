import { Injectable } from '@angular/core';
import { PriceBatch, Product } from 'src/app/models/product';
import { Order } from '../models/order';
import { OrderSummary } from '../models/order-summary';
import { DataService } from '../services/data.service';
import { CartItem } from './../models/cart-item';
import { GrossWeight } from './../models/gross-weight';
import { AlertService } from './../services/alert.service';
import { ApiService } from './../services/api.service';
import { UnitType } from './enums';
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
        if (weight === 1) {
            return `${weight} Gm`
        }
        if (weight < 1000) {
            return `${weight} Gms`
        }
        if (weight == 1000) {
            return `${weight / 1000} KG`
        }
        return `${weight / 1000} KGs`
    }

    availableQuantity(product: Product, subIndex?): number {
        var usedQuantity = 0
        subIndex = subIndex == null ? product.subIndex : subIndex
        this.orderSummary.cartItems.forEach(item => {
            if (item.product._id == product._id &&
                item.product.selectedIndex == product.selectedIndex &&
                item.product.subIndex == subIndex) {
                usedQuantity += this.convertToRequiredUnit({
                    quantity: item.noOfItems,
                    sourceUnit: item.product.selectedUnit,
                    bunchPerPack: item.product.bunchInfo?.bunchPerPacket,
                })
            }
        })
        return product.quantity[product.selectedIndex][subIndex] - usedQuantity
    }

    decreaseProductQuantity(item: CartItem) {
        if (item.noOfItems > 1) {
            item.noOfItems--
            item.itemsWeight = this.getWeightForUnit(
                item.noOfItems,
                item.product
            )
            item.itemsCost = this.getPriceForUnit(
                item.product.selectedUnit,
                item.noOfItems,
                item.product.price[item.product.selectedIndex][item.product.subIndex],
                item.product.bunchInfo?.price
            )
            item.discountedCost = this.getDiscountedPrice(
                item.itemsCost,
                item.noOfItems,
                item.product.selectedUnit,
                item.product.priceBatches
            )
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight -= item.itemsWeight / item.noOfItems
            this.orderSummary.totalProductCost -= item.discountedCost / item.noOfItems
            this.orderSummary.grandTotal -= item.discountedCost / item.noOfItems
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
        } else {
            this.alertService.error('Quantity cannot be less than 1', true)
        }
    }

    increaseProductQuantity(item: CartItem) {
        var availableQuantity = this.availableQuantity(item.product)
        if (availableQuantity >= this.convertToRequiredUnit({
            quantity: 1,
            sourceUnit: item.product.selectedUnit,
            bunchPerPack: item.product.bunchInfo?.bunchPerPacket,
        })/*  && item.noOfItems < 100 */) {
            item.noOfItems++
            item.itemsWeight = this.getWeightForUnit(
                item.noOfItems,
                item.product
            )
            item.itemsCost = this.getPriceForUnit(
                item.product.selectedUnit,
                item.noOfItems,
                item.product.price[item.product.selectedIndex][item.product.subIndex],
                item.product.bunchInfo?.price
            )
            item.discountedCost = this.getDiscountedPrice(
                item.itemsCost,
                item.noOfItems,
                item.product.selectedUnit,
                item.product.priceBatches
            )
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight += item.itemsWeight / item.noOfItems
            this.orderSummary.totalProductCost += item.discountedCost / item.noOfItems
            this.orderSummary.grandTotal += item.discountedCost / item.noOfItems
            this.orderSummary.grandTotal -= this.orderSummary.shippingCost
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            this.dataService.changeOrderDetails(this.orderSummary)
        } else {
            /* if (item.noOfItems == 100 && item.product.quantity[item.product.selectedIndex][item.product.subIndex] > item.noOfItems) {
                this.alertService.error(`You can buy Only 100 items at a time of same kind`, true)
                return
            } */
            availableQuantity = this.getQuantityForUnit({
                quantity: availableQuantity,
                prevUnit: item.product.selectedUnit,
                newUnit: this.getUnits(item.product.unitType)[0],
                bunchPerPack: item.product.bunchInfo?.bunchPerPacket,
            })
            this.alertService.error(`Cannot increase quantity, Available =  ${availableQuantity} 
            ${this.formatUnit(item.product.selectedUnit, availableQuantity)}`, true)
        }
    }

    addItemToCart(item: CartItem) {
        var sameItem = this.findSameItemInCart(item.product)
        if (sameItem) {
            sameItem.noOfItems += this.getQuantityForUnit({
                quantity: item.noOfItems,
                prevUnit: sameItem.product.selectedUnit,
                newUnit: item.product.selectedUnit,
                bunchPerPack: item.product.bunchInfo?.bunchPerPacket,
            })
            this.alertService.success(`Same product already added, increased item's quantity by ${item.noOfItems} ${this.formatUnit(item.product.selectedUnit, item.noOfItems)}`)
            this.updateCartProduct(sameItem)
        } else {
            this.orderSummary.cartItems.set(item.id, item)
            this.orderSummary.productNetWeight += item.itemsWeight
            this.orderSummary.totalProductCost += item.discountedCost
            this.orderSummary.grandTotal += item.discountedCost
            this.orderSummary.shippingCost = 0
            this.calculateGrossWeight(this.orderSummary.productNetWeight)
            this.dataService.changeOrderDetails(this.orderSummary);
            this.alertService.success(`Item added to cart`, true)
            return item.id
        }
    }

    removeItemFromCart(item: CartItem) {
        this.orderSummary.productNetWeight -= item.itemsWeight
        this.orderSummary.totalProductCost -= item.discountedCost
        this.orderSummary.grandTotal -= item.discountedCost
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

    updateCartProduct(item: CartItem, unitChanged: boolean = false) {
        if (!unitChanged) {
            item.itemsWeight = this.getWeightForUnit(
                item.noOfItems,
                item.product
            )
            item.itemsCost = this.getPriceForUnit(
                item.product.selectedUnit,
                item.noOfItems,
                item.product.price[item.product.selectedIndex][item.product.subIndex],
                item.product.bunchInfo?.price
            )
            item.discountedCost = this.getDiscountedPrice(
                item.itemsCost,
                item.noOfItems,
                item.product.selectedUnit,
                item.product.priceBatches
            )
        }
        this.orderSummary.cartItems.set(item.id, item)
        this.orderSummary.productNetWeight = 0
        this.orderSummary.totalProductCost = 0
        //update for new price and weight
        this.orderSummary.cartItems.forEach(item => {
            this.orderSummary.productNetWeight += item.itemsWeight
            this.orderSummary.totalProductCost += item.discountedCost
        })
        this.orderSummary.shippingCost = 0
        this.orderSummary.grandTotal = this.orderSummary.totalProductCost
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
            if (product._id === item.product._id &&
                product.selectedIndex === item.product.selectedIndex &&
                product.subIndex === item.product.subIndex &&
                ((product.unitType === UnitType.PACKET &&
                    product.selectedUnit === item.product.selectedUnit) ||
                    product.unitType !== UnitType.PACKET
                )) {
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

    getUnits(unitType: number): string[] {
        switch (unitType) {
            case UnitType.PACKET:
                return ['Pack', 'Bunch']
            case UnitType.WEIGHT:
                return ['Gram', 'Kg']
            case UnitType.LENGTH:
                return ['Meter']
            case UnitType.PIECE:
                return ['Pc']
        }
    }

    getDiscountedPrice(price: number, quantity: number, unit: string, priceBatches: PriceBatch[]): number {
        var discountedPrice = price
        var isPacketType = unit === 'Pack' || unit === 'Bunch'
        var resolvedQuantity = quantity
        for (var batch of priceBatches) {
            if (unit === 'Gram' || unit === 'Kg') {
                resolvedQuantity = this.getQuantityForUnit({
                    quantity: quantity,
                    prevUnit: batch.unit,
                    newUnit: unit,
                    bunchPerPack: null
                })
            }
            if ((!isPacketType || unit === batch.unit) &&
                batch.minQuantity <= resolvedQuantity &&
                (batch.maxQuantity >= resolvedQuantity || batch.maxQuantity == null)) {
                discountedPrice = price - (price * batch.discountPercentage / 100)
                break
            }
        }
        return discountedPrice
    }

    getPriceForUnit(unit: string, quantity: number, price: number, bunchPrice?: number): number {
        switch (unit) {
            case 'Pack':
            case 'Gram':
            case 'Meter':
            case 'Pc':
                return price * quantity
            case 'Bunch':
                return bunchPrice * quantity
            case 'Kg':
                return price * 1000 * quantity
        }
    }

    getWeightForUnit(quantity: number, product: Product): number {
        var weight = product.weight?.length > 0 ? product.weight[product.selectedIndex][product.subIndex] : 0
        switch (product.selectedUnit) {
            case 'Pack':
            case 'Meter':
            case 'Pc':
                return weight * quantity
            case 'Gram':
                return quantity
            case 'Bunch':
                return product.bunchInfo?.weight * quantity
            case 'Kg':
                return quantity * 1000
        }
    }

    getQuantityForUnit({ quantity, prevUnit, newUnit, bunchPerPack }): number {
        switch (prevUnit) {
            case 'Meter':
            case 'Pc':
                return quantity
            case 'Pack':
                return newUnit === 'Bunch' ? quantity / bunchPerPack : quantity
            case 'Bunch':
                return newUnit === 'Pack' ? quantity * bunchPerPack : quantity
            case 'Gram':
                return newUnit === 'Kg' ? quantity * 1000 : quantity
            case 'Kg':
                return newUnit === 'Gram' ? quantity / 1000 : quantity
        }
    }

    convertToRequiredUnit({ sourceUnit, quantity, bunchPerPack }): number {
        // Required units are Pack, Gram and Meter
        switch (sourceUnit) {
            case 'Pack':
            case 'Gram':
            case 'Meter':
            case 'Pc':
                return quantity
            case 'Bunch':
                return quantity / bunchPerPack //converting to Pack
            case 'Kg':
                return quantity * 1000 // converting to Gram
        }
    }

    changeInItem(value: string, changeType: string, item: CartItem) {
        var availableQuantity = this.availableQuantity(item.product)
        if (changeType === 'quantity') {
            var newQuantity = parseInt(value)
            if (isNaN(newQuantity) || newQuantity <= 0) {
                this.alertService.error('Invalid Quantity: should be greater than 0', true)
                return false
            } else {
                newQuantity = this.convertToRequiredUnit({
                    sourceUnit: item.product.selectedUnit,
                    quantity: newQuantity,
                    bunchPerPack: item.product.bunchInfo?.bunchPerPacket
                })
                var cartItemQuantity = this.convertToRequiredUnit({
                    sourceUnit: item.product.selectedUnit,
                    quantity: item.noOfItems,
                    bunchPerPack: item.product.bunchInfo?.bunchPerPacket
                })
                if (newQuantity > cartItemQuantity && newQuantity > availableQuantity + cartItemQuantity) {
                    availableQuantity = this.getQuantityForUnit({
                        quantity: availableQuantity,
                        prevUnit: item.product.selectedUnit,
                        newUnit: this.getUnits(item.product.unitType)[0],
                        bunchPerPack: item.product.bunchInfo?.bunchPerPacket
                    })
                    this.alertService.error(`Quantity cannot be greater than available quantity (Available = 
                    ${availableQuantity} ${this.formatUnit(item.product.selectedUnit, availableQuantity)})`, true)
                    return false
                } else {
                    item.noOfItems = parseInt(value)
                }
            }
        } else {
            var quantityInNewUnit = this.convertToRequiredUnit({
                sourceUnit: value,
                quantity: item.noOfItems,
                bunchPerPack: item.product.bunchInfo?.bunchPerPacket
            })
            var quantityInOldUnit = this.convertToRequiredUnit({
                sourceUnit: item.product.selectedUnit,
                quantity: item.noOfItems,
                bunchPerPack: item.product.bunchInfo?.bunchPerPacket
            })
            if (quantityInNewUnit > availableQuantity + quantityInOldUnit) {
                availableQuantity = this.getQuantityForUnit({
                    quantity: availableQuantity,
                    prevUnit: value,
                    newUnit: this.getUnits(item.product.unitType)[0],
                    bunchPerPack: item.product.bunchInfo?.bunchPerPacket
                })
                this.alertService.error(`Quantity cannot be greater than available quantity (Available = 
                    ${availableQuantity} ${this.formatUnit(value, availableQuantity)})`, true)
                return { 'value': false }
            } else {
                item.product.selectedUnit = value
            }
        }
        item.itemsCost = this.getPriceForUnit(
            item.product.selectedUnit,
            item.noOfItems,
            item.product.price[item.product.selectedIndex][item.product.subIndex],
            item.product.bunchInfo?.price
        )
        item.discountedCost = this.getDiscountedPrice(
            item.itemsCost,
            item.noOfItems,
            item.product.selectedUnit,
            item.product.priceBatches
        )
        item.itemsWeight = this.getWeightForUnit(
            item.noOfItems,
            item.product
        )
        if (this.orderSummary.cartItems.has(item.id)) {
            this.updateCartProduct(item, true)
        }
    }

    formatUnit(unit: string, quantity: number): string {
        if (quantity <= 1) {
            return unit.toLowerCase()
        } else if (unit === 'Bunch') {
            return (unit + 'es').toLowerCase()
        } else {
            return (unit + 's').toLowerCase()
        }
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
