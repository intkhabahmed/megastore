export class Product {
    _id: string
    name: string
    productCode: string
    description: string
    imageUrl: string[]
    category: string
    subCategory: string
    price: number[][] = []
    productStatus: Boolean
    quantity: number[][] = []
    colors: string[]
    weight: number[][] = []
    size: string[][] = []
    selectedIndex: number
    subIndex: number
    message: string
    createdAt: Date
    updatedAt: Date
}
