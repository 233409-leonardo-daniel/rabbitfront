import { OrderDTO } from "../data/models/OrderDTO";
import { Order } from "../data/models/Order";
import { OrderRepository } from "../data/repository/OrderRepository";

export class UpdateOrderUseCase {
    orderRepository: OrderRepository

    constructor() {
        this.orderRepository = new OrderRepository()
    }

    async execute(id: number, order: Order): Promise<OrderDTO | null> {
        const response: OrderDTO | null = await this.orderRepository.update(id, order)
        
        var data = null
        if (response != null)
            data = new OrderDTO(response.id, response.idProduct, response.quantity, response.totalPrice, response.status, response.orderDate)
        
        return data;
    }
} 