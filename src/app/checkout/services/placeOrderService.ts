import api from "@/utils/api";
import { PlaceOrderRequest, PlaceOrderResponse } from "../models/PlaceOrder.dtos";

export default class PlaceOrderService {

    static async placeOrder(orderData: PlaceOrderRequest, token: string) : Promise<PlaceOrderResponse> {
        
        const res = await api.post('/order', orderData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        if (res.status === 201) {
            return res.data as PlaceOrderResponse;
        } else {
            throw new Error('Failed to place order');
        }

    }

}