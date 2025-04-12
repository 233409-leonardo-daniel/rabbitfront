import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { OrderViewModel } from '../viewmodels/OrderViewModel';
import { ProductViewModel } from '../../../products/presentation/viewmodels/ProductViewModel';
import './OrderListView.css';

interface OrderListViewProps {
  orderViewModel: OrderViewModel;
  productViewModel: ProductViewModel;
}

export const OrderListView = observer(({ orderViewModel, productViewModel }: OrderListViewProps) => {
  useEffect(() => {
    const loadOrders = async () => {
      await orderViewModel.loadOrders();
    };

    loadOrders();
  }, [orderViewModel]);

  return (
    <div className="container">
      <h2 className="header">Órdenes Existentes</h2>
      <div className="order-list space-y-2">
        {orderViewModel.orders.map((order) => {
          const orderProduct = productViewModel.products.find(p => p.id === order.idProduct);
          return (
            <div key={order.id} className="order-card">
              <p>Producto: {orderProduct ? orderProduct.name : 'Desconocido'}</p>
              <p>Cantidad: {order.quantity}</p>
              <p>Total: ${order.totalPrice}</p>
            </div>
          );
        })}
      </div>

      
      <div className="mt-4">
        <button 
          className="button" 
          onClick={() => window.location.href = '/'}
        >
          Regresar a Crear Orden
        </button>
        <button 
          className="button ml-4" 
          onClick={() => window.location.href = '/products'}
        >
          Ir a Gestión de Productos
        </button>
      </div>
    </div>
  );
});
