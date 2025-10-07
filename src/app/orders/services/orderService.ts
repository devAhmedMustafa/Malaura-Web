import api from "@/utils/api";
import { Order } from "../models/Order.dto";

export default class OrderService {
  
    static async getCustomerOrders() : Promise<Order[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated');
        }
        const res = await api.get(`/order/customer`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    }

    static async getDetailedOrder(orderId: string) : Promise<Order> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('User is not authenticated');
        }
        const res = await api.get(`/order/detailed/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    }
    
}