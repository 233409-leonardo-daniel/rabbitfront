import { makeAutoObservable, runInAction } from "mobx";
import { Order } from "../../data/models/Order";
import { CreateOrderUseCase } from "../../domain/CreateOrderUseCase";
import { GetOrdersUseCase } from "../../domain/GetOrdersUseCase";
import { UpdateOrderUseCase } from "../../domain/UpdateOrderUseCase";
import { DeleteOrderUseCase } from "../../domain/DeleteOrderUseCase";
import { OrderDTO } from "../../data/models/OrderDTO";

export class OrderViewModel {
    idProduct: number = 0;
    quantity: number = 0;
    totalPrice: number = 0;
    status: string = 'Pending';
    error: string | null = null;
    isValid: boolean = false;
    orders: OrderDTO[] = [];
    isLoading: boolean = false;
    selectedOrder: OrderDTO | null = null;
    createOrderUseCase: CreateOrderUseCase;
    getOrdersUseCase: GetOrdersUseCase;
    updateOrderUseCase: UpdateOrderUseCase;
    deleteOrderUseCase: DeleteOrderUseCase;

    constructor() {
        makeAutoObservable(this);
        this.createOrderUseCase = new CreateOrderUseCase();
        this.getOrdersUseCase = new GetOrdersUseCase();
        this.updateOrderUseCase = new UpdateOrderUseCase();
        this.deleteOrderUseCase = new DeleteOrderUseCase();
    }

    resetForm() {
        runInAction(() => {
            this.idProduct = 0;
            this.quantity = 0;
            this.totalPrice = 0;
            this.status = 'Pending';
            this.error = null;
            this.isValid = false;
            this.selectedOrder = null;
        });
    }

    onChangeIdProduct(idProduct: number) {
        runInAction(() => {
            this.idProduct = idProduct;
        });
    }

    onChangeQuantity(quantity: string) {
        runInAction(() => {
            this.quantity = Number(quantity) || 0;
        });
    }

    onChangeTotalPrice(totalPrice: string) {
        runInAction(() => {
            this.totalPrice = Number(totalPrice) || 0;
        });
    }

    onChangeStatus(status: string) {
        runInAction(() => {
            this.status = status || 'Pending';
        });
    }

    setSelectedOrder(order: OrderDTO | null) {
        runInAction(() => {
            this.selectedOrder = order;
            this.isValid = false;
            if (order) {
                this.idProduct = order.idProduct || 0;
                this.quantity = order.quantity || 0;
                this.totalPrice = order.totalPrice || 0;
                this.status = order.status || 'Pending';
            } else {
                this.resetForm();
            }
        });
    }

    async doCreateOrder() {
        this.error = null;
        this.isValid = false;

        if (this.idProduct > 0 && this.quantity > 0) {
            try {
                const order = new Order(
                    this.idProduct,
                    this.quantity,
                    this.totalPrice,
                );

                const response = await this.createOrderUseCase.execute(order);
                if (response) {
                   
                    const ws = new WebSocket('ws://localhost:8083/ws');
                    ws.onopen = () => {
                        ws.send(`Orden creada: ${response.id}`);
                    };
                }
            } catch (error) {
                this.error = (error instanceof Error) ? error.message : "Error al crear la orden";
            }
        } else {
            this.error = "Seleccione un producto y especifique una cantidad mayor a 0";
        }
    }

    async doUpdateOrder() {
        this.error = null;
        this.isValid = false;

        if (this.selectedOrder && this.idProduct > 0 && this.quantity > 0 && this.totalPrice > 0) {
            let order = new Order(this.idProduct, this.quantity, this.totalPrice, this.status);
            try {
                let data = await this.updateOrderUseCase.execute(this.selectedOrder.id, order);
                runInAction(() => {
                    if (data != null) {
                        this.loadOrders();
                        this.isValid = true;
                    }
                });
            } catch (err: any) {
                runInAction(() => {
                    this.error = err.message || "Error al actualizar la orden";
                });
            }
        } else {
            this.error = "Todos los campos son requeridos y deben ser mayores a 0";
        }
    }

    async doDeleteOrder(id: number) {
        this.error = null;

        try {
            const success = await this.deleteOrderUseCase.execute(id);
            runInAction(() => {
                if (success) {
                    this.loadOrders();
                } else {
                    this.error = "Error al eliminar la orden";
                }
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message || "Error al eliminar la orden";
            });
        }
    }

    async loadOrders() {
        runInAction(() => {
            this.isLoading = true;
            this.error = null;
        });

        try {
            const orders = await this.getOrdersUseCase.execute();
            runInAction(() => {
                this.orders = orders;
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message || "Error al cargar las órdenes";
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}
