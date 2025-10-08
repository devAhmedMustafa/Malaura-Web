export class PlaceOrderRequest {
    storeId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    latitude: number;
    longitude: number;
    items: {
        itemId: string;
        quantity: number;
    }[];
    paymentMethod: 'cash' | 'card' | 'online';
    orderType: 2 | 1 = 2;
    deliveryDetails?: {
        address: string;
        latitude: number;
        longitude: number;
    }
    notes?: string;

    constructor(data: {
        storeId: string;
        customerId: string;
        customerName: string;
        customerPhone: string;
        latitude: number;
        longitude: number;
        items: { itemId: string; quantity: number }[];
        paymentMethod: 'cash' | 'card' | 'online';
        address?: string;
    }) {
        this.storeId = data.storeId;
        this.customerId = data.customerId;
        this.customerName = data.customerName;
        this.customerPhone = data.customerPhone;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.items = data.items;
        this.paymentMethod = data.paymentMethod;
        
        if (this.orderType === 2 && data.address) {
            this.deliveryDetails = {
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
            }
        }
    }
}

export interface PlaceOrderResponse {
    orderId: string;
    orderIntentId: string;
    redirectUrl?: string;
}
