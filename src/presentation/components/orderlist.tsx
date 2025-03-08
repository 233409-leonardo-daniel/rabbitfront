import { Order } from "../../features/order/domain/order";

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
}

export const OrderList = ({ orders, isLoading }: OrderListProps) => {
  if (isLoading) {
    return <div className="orders-loading">Cargando órdenes...</div>;
  }

  if (orders.length === 0) {
    return <div className="no-orders">No se encontraron órdenes</div>;
  }

  return (
    <div className="orders-list-container">
      <h2>Órdenes</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-header">
              <h3>Orden #{order.id}</h3>
              <p><strong>Estado:</strong> {order.status}</p>
              <p><strong>Fecha de Orden:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            </div>
            <div className="order-details">
              <p><strong>ID del Producto:</strong> {order.idProduct}</p>
              <p><strong>Cantidad:</strong> {order.quantity}</p>
              <p><strong>Precio Total:</strong> ${order.totalPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
