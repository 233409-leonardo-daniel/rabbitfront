export class Order {
    idProduct: number;
    quantity: number;
    totalPrice: number;
    status: string;

    constructor(
        idProduct: number, 
        quantity: number, 
        totalPrice: number, 
        status: string = 'Pending'
    ) {
        this.idProduct = idProduct;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = status;
    }
} 