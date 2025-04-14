import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { OrderUpdatesViewModel } from '../viewmodels/OrderUpdatesViewModel';
import './OrderUpdatesView.css';

export const OrderUpdatesView = observer(() => {
    const [viewModel] = useState(() => new OrderUpdatesViewModel());

    useEffect(() => {
        
        return () => {
            viewModel.dispose();
        };
    }, []); 

    return (
        <div className="order-updates">
            <h2 className="header">Actualizaciones de Órdenes en Tiempo Real</h2>
            {viewModel.error && (
                <div className="error-message">
                    {viewModel.error}
                    <p>Intentando reconectar automáticamente... (Intento {viewModel.reconnectAttempts}/5)</p>
                </div>
            )}
            <div className="updates-list">
                {viewModel.orders.length === 0 ? (
                    <div className="no-orders">
                        <p>Esperando actualizaciones de órdenes...</p>
                    </div>
                ) : (
                    viewModel.orders.map((order, index) => (
                        <div key={`${order.id}-${index}`} className="update-card">
                            <h3>Nueva Actualización de Orden</h3>
                            <div className="update-details">
                                <p><strong>Producto:</strong> {viewModel.getProductName(order.idProduct)}</p>
                                <p><strong>Cantidad:</strong> {order.quantity}</p>
                                <p><strong>Precio Total:</strong> ${order.totalPrice}</p>
                                <p><strong>Estado:</strong> 
                                    <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});
