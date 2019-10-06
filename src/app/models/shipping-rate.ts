export class ShippingRate {
    _id: string
    rate: number
    minDistance: number
    maxDistance: number
    minWeight: number
    maxWeight: number
    perKgRate: number
    halfKgRate: number
    isLocal: boolean
    area: string
    shippingMethod: number
}