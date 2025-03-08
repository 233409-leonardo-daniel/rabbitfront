import { Order } from "./order";

export interface OrderRepository{
    getAll(): Promise<Order[]>;
    create(order: Order): Promise<Order>;
}