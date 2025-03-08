import axios from 'axios';
import { Order } from "../domain/order";
import { OrderRepository } from "../domain/order_repository";

const API_URL = 'http://localhost:8080';

export class AxiosOrderRepository implements OrderRepository {

    async getAll(): Promise<Order[]> {
        try {
            const response = await axios.get<Order[]>(`${API_URL}/orders`);
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const response = await axios.post<Order>(`${API_URL}/orders`, order);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error; 
        }
    }
}
