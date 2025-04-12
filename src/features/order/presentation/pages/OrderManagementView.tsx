import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { OrderViewModel } from '../viewmodels/OrderViewModel';
import { ProductViewModel } from '../../../products/presentation/viewmodels/ProductViewModel';
import './OrderManagementView.css';

interface OrderManagementViewProps {
  viewModel: OrderViewModel;
}

export const OrderManagementView = observer(({ viewModel }: OrderManagementViewProps) => {
  const [productViewModel] = useState(() => new ProductViewModel());
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          viewModel.loadOrders(),
          productViewModel.loadProducts()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [viewModel, productViewModel]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8083/ws');

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
      setOrderStatus(event.data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('Conexión WebSocket cerrada');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProduct = productViewModel.products.find(
      product => product.id === Number(e.target.value)
    );
    
    if (selectedProduct) {
      viewModel.onChangeIdProduct(selectedProduct.id);
      viewModel.onChangeTotalPrice(String(selectedProduct.price * viewModel.quantity));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = Number(e.target.value);
    viewModel.onChangeQuantity(e.target.value);
    
    const selectedProduct = productViewModel.products.find(
      product => product.id === viewModel.idProduct
    );
    
    if (selectedProduct) {
      viewModel.onChangeTotalPrice(String(selectedProduct.price * quantity));
    }
  };

  const handleCreateOrder = async () => {
    if (!currentProduct) {
        viewModel.error = "Por favor seleccione un producto";
        return;
    }

    if (viewModel.quantity <= 0) {
        viewModel.error = "La cantidad debe ser mayor a 0";
        return;
    }

    const totalPrice = currentProduct.price * viewModel.quantity;
    viewModel.onChangeTotalPrice(String(totalPrice));

    await viewModel.doCreateOrder();
  };

  const toggleShowForm = () => {
    setShowForm(prev => !prev);
  };

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  const currentProduct = productViewModel.products.find(
    product => product.id === viewModel.idProduct
  );

  return (
    <div className="container">
      <div className="flex flex-col mb-4">
        <h1 className="header">Crear Nueva Orden</h1>
      </div>

      <button className="button mb-4" onClick={toggleShowForm}>
        {showForm ? 'Ocultar Formulario' : 'Ordenar'}
      </button>

      {showForm && (
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="label">Seleccionar Producto:</label>
            <select
              className="select"
              value={viewModel.idProduct || ''}
              onChange={handleProductChange}
            >
              <option value="">Seleccione un producto</option>
              {productViewModel.products.length > 0 ? (
                productViewModel.products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </option>
                ))
              ) : (
                <option disabled>No hay productos disponibles</option>
              )}
            </select>
            {currentProduct && (
              <span className="text-sm text-gray-600 mt-1">
                Producto seleccionado: {currentProduct.name}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="label">Cantidad:</label>
            <input
              type="number"
              className="input"
              min="1"
              value={viewModel.quantity}
              onChange={handleQuantityChange}
            />
          </div>

          <div className="flex flex-col">
            <label className="label">Precio Total:</label>
            <span className="text-lg font-semibold">${viewModel.totalPrice}</span>
          </div>

          <button 
            className="button"
            onClick={handleCreateOrder}
            disabled={!viewModel.idProduct || viewModel.quantity <= 0}
          >
            Crear Orden
          </button>

          {viewModel.error && (
            <p className="error">{viewModel.error}</p>
          )}
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>
      <div className="product-list mt-8">
        {productViewModel.products.map((product) => (
          <div key={product.id} className="product-card">
            <p className="font-semibold">Nombre: {product.name}</p>
            <p>Precio: ${product.price}</p>
          </div>
        ))}
      </div>

      {/* Botón para ver la lista de órdenes al final */}
      <button 
        className="button small-button mt-4" 
        onClick={() => window.location.href = '/order-list'}
      >
        Ver Órdenes
      </button>

      {orderStatus && <p>{orderStatus}</p>}
    </div>
  );
});