import { makeAutoObservable } from "mobx";
import { ProductViewModel } from "../../../products/presentation/viewmodels/ProductViewModel";

interface OrderUpdate {
    id: number;
    idProduct: number;
    quantity: number;
    totalPrice: number;
    status: string;
}

export class OrderUpdatesViewModel {
    orders: OrderUpdate[] = [];
    error: string | null = null;
    reconnectAttempts = 0;
    private ws: WebSocket | null = null;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: number | null = null;
    private productViewModel: ProductViewModel;

    constructor() {
        this.productViewModel = new ProductViewModel();
        makeAutoObservable(this);
        this.initializeWebSocket();
        this.loadProducts();
    }

    private async loadProducts() {
        await this.productViewModel.loadProducts();
    }

    
    getProductName(productId: number): string {
        const product = this.productViewModel.products.find(p => p.id === productId);
        return product ? product.name : 'Producto no encontrado';
    }

    private initializeWebSocket() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        try {
            this.ws = new WebSocket('ws://localhost:8083/ws');
            
            this.ws.onopen = () => {
                this.error = null;
                this.reconnectAttempts = 0;
                console.log('Conexión WebSocket establecida');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('Mensaje recibido:', data);
                    if (data.type === 'order_update') {
                        this.addOrder(data.data);
                    }
                } catch (error) {
                    console.error('Error al procesar mensaje:', error);
                    this.error = 'Error al procesar mensaje WebSocket';
                }
            };

            this.ws.onerror = (error) => {
                console.error('Error WebSocket:', error);
                this.error = 'Error en la conexión WebSocket';
            };

            this.ws.onclose = () => {
                console.log('Conexión WebSocket cerrada');
                this.ws = null;
                this.attemptReconnect();
            };
        } catch (error) {
            console.error('Error al inicializar WebSocket:', error);
            this.error = 'Error al inicializar WebSocket';
            this.attemptReconnect();
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Intento de reconexión ${this.reconnectAttempts}...`);

            if (this.reconnectTimeout) {
                window.clearTimeout(this.reconnectTimeout);
            }

            this.reconnectTimeout = window.setTimeout(() => {
                this.initializeWebSocket();
            }, 3000);
        }
    }

    private addOrder(order: OrderUpdate) {
        this.orders = [order, ...this.orders];
        if (this.orders.length > 50) {
            this.orders = this.orders.slice(0, 50);
        }
    }

    dispose() {
        if (this.reconnectTimeout) {
            window.clearTimeout(this.reconnectTimeout);
        }
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
