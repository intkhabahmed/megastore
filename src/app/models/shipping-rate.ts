export class ShippingRate {
    _id: string
    rate: number
    minDistance: number
    maxDistance: number
    minWeight: number
    maxWeight: number
    perKgRate: number
    halfKgRate: number
    localRate: number
    area: string
    shippingMethod: string
}