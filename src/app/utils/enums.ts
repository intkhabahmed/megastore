export enum AdminTab {
    NEW_PRODUCT_UPLOAD,
    PRODUCT_LIST,
    POPULAR_PRODUCTS,
    ORDER_INVOICE,
    SHIPPING_RATES,
    GROSS_WEIGHT_CALCULATOR,
    REGISTERED_USERS,
    MESSAGES,
    CATEGORIES,
    BANNERS,
    NEW_ARRIVALS
}

export enum ShippingMethod {
    REGISTERED_POST,
    SPEED_POST,
    DTDC,
    PROFESSIONAL,
    SHREE_MAHAVIR
}

export enum OrderStatus {
    PROCESSING,
    SHIPPED,
    DELIVERED,
    FAILED,
}

export enum UnitType {
    PACKET,
    WEIGHT,
    LENGTH,
    PIECE,
}
