import { OrderDTO } from "../models/OrderDTO";
import { Order } from "../models/Order";

export class OrderRepository {
    private baseUrl = 'http://localhost:8080/orders/publish'; 

    async create(order: Order): Promise<OrderDTO> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idProduct: order.idProduct,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    status: 'Pending'  
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Error response:', errorData);
                throw new Error(errorData?.message || 'Error al crear la orden');
            }

            const data = await response.json();
            return new OrderDTO(
                data.id,
                data.idProduct,
                data.quantity,
                data.totalPrice,
                data.status,
                new Date(data.orderDate)
            );
        } catch (error) {
            console.error('Error en OrderRepository.create:', error);
            throw error;
        }
    }

    async getAll(): Promise<OrderDTO[]> {
        const response = await fetch('http://localhost:8082/orders', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (!response.ok) return [];

        const data: OrderDTO[] = await response.json();
        return data.map(order => new OrderDTO(order.id, order.idProduct, order.quantity, order.totalPrice, order.status, order.orderDate));
    }

    async update(id: number, order: Order): Promise<OrderDTO | null> {
        const response = await fetch(`http://localhost:8082/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                idProduct: order.idProduct,
                quantity: order.quantity,
                totalPrice: order.totalPrice,
                status: order.status
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        if (!response.ok) return null;

        const data: OrderDTO = await response.json();
        return new OrderDTO(data.id, data.idProduct, data.quantity, data.totalPrice, data.status, data.orderDate);
    }

    async delete(id: number): Promise<boolean> {
        const response = await fetch(`http://localhost:8080/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });

        return response.ok;
    }
} 