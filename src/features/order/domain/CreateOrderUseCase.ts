import { OrderDTO } from "../data/models/OrderDTO";
import { Order } from "../data/models/Order";
import { OrderRepository } from "../data/repository/OrderRepository";

export class CreateOrderUseCase {
    orderRepository: OrderRepository

    constructor() {
        this.orderRepository = new OrderRepository()
    }

    async execute(order: Order): Promise<OrderDTO | null> {
        try {
            const response = await this.orderRepository.create(order);
            if (response) {
                return new OrderDTO(
                    response.id,
                    response.idProduct,
                    response.quantity,
                    response.totalPrice,
                    response.status,
                    response.orderDate
                );
            }
            return null;
        } catch (error) {
            console.error('Error en CreateOrderUseCase:', error);
            throw error;
        }
    }
} 