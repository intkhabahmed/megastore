export class Product {
    _id: string
    name: string
    productCode: string
    description: string
    longDescription: LongDescription[]
    imageUrl: string[]
    category: string
    subCategory: string
    unitType: number
    bunchInfo?: BunchInfo
    price: number[][] = []
    priceBatches?: PriceBatch[]
    productStatus: Boolean
    quantity: number[][] = []
    colors: string[]
    weight?: number[][]
    size: string[][] = []
    selectedIndex: number //not for database
    selectedUnit: string //not for database
    subIndex: number //not for database
    message: string //not for database
    createdAt: Date
    updatedAt: Date
}

export class LongDescription {
    title: string
    value: string
}

export class PriceBatch {
    unit: string
    minQuantity: number
    maxQuantity?: number
    discountPercentage: number
}

export class BunchInfo {
    bunchPerPacket: number
    weight: number
    price: number
}
