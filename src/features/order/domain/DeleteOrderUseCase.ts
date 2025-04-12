import { OrderRepository } from "../data/repository/OrderRepository";

export class DeleteOrderUseCase {
    orderRepository: OrderRepository

    constructor() {
        this.orderRepository = new OrderRepository()
    }

    async execute(id: number): Promise<boolean> {
        return await this.orderRepository.delete(id);
    }
} 