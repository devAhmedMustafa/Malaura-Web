import Item from "@/app/items/models/Item";

export interface Order {

    orderId: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    orderItems?: { itemId: string; quantity: number; item?: Item }[];
    paymentMethod: 'cash';
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
    isPaid: boolean;
    deliveryDetails?: {
        address: string;
        latitude: number;
        longitude: number;
    };

}