import { OrderDTO } from "../data/models/OrderDTO";
import { OrderRepository } from "../data/repository/OrderRepository";

export class GetOrdersUseCase {
    orderRepository: OrderRepository

    constructor() {
        this.orderRepository = new OrderRepository()
    }

    async execute(): Promise<OrderDTO[]> {
        return await this.orderRepository.getAll();
    }
} 