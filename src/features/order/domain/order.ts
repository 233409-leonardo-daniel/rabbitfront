export interface Order {
    id: number;
    idProduct: number;
    quantity: number;
    totalPrice: number;
    status: string;
    orderDate: Date;
}