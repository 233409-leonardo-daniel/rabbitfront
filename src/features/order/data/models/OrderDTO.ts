export class OrderDTO {
    id: number;
    idProduct: number;
    quantity: number;
    totalPrice: number;
    status: string;
    orderDate: Date;

    constructor(id: number, idProduct: number, quantity: number, totalPrice: number, status: string, orderDate: Date) {
        this.id = id;
        this.idProduct = idProduct;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
        this.orderDate = orderDate;
    }
} 