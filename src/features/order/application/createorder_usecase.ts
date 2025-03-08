import { Order } from "../domain/order";
import { OrderRepository } from "../domain/order_repository";

export class CreateOrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async execute(order: Order): Promise<Order> {
        try {
            return await this.orderRepository.create(order);
        } catch (error) {
            console.error('Error in CreateOrderUseCase:', error);
            throw error; 
        }
    }
}
