import { Order } from "../domain/order";
import { OrderRepository } from "../domain/order_repository";

export class GetOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute(): Promise<Order[]> {
        try {
            return await this.orderRepository.getAll(); 
        } catch (error) {
            console.error('Error in GetOrderUseCase:', error);
            return [];
        }
    }
}
