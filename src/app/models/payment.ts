export class Payment {
    _id: string
    orderId: string
    trackingId: string
    bankRefNo: string
    orderStatus: string
    failureMessage: string
    paymentMode: string
    cardName: string
    statusCode: number
    statusMessage: string
    amount: number
    transDate: Date
}