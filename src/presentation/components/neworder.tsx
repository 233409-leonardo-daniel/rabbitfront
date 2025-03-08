import React, { useState } from 'react';
import { Product } from "../../features/product/domain/product";
import { Order } from "../../features/order/domain/order";

interface NewOrderProps {
  products: Product[];
  onCreateOrder: (order: Order) => void; 
}

export const NewOrder = ({ products, onCreateOrder }: NewOrderProps) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const handleCreateOrder = () => {
    if (selectedProductId !== null) {
      const selectedProduct = products.find(product => product.id === selectedProductId);
      if (selectedProduct) {
        const newOrder: Order = {
          id: Date.now(), 
          idProduct: selectedProduct.id,
          quantity: quantity,
          totalPrice: selectedProduct.price * quantity,
          status: "Pending",
          orderDate: new Date(),
        };
        onCreateOrder(newOrder); 
      }
    }
  };

  return (
    <div className="new-order-container">
      <h2>Crear Nueva Orden</h2>
      <div>
        <label htmlFor="product-select">Selecciona un producto:</label>
        <select
          id="product-select"
          value={selectedProductId || ''}
          onChange={(e) => setSelectedProductId(Number(e.target.value))}
        >
          <option value="">-- Selecciona un producto --</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="quantity">Cantidad:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min={1}
        />
      </div>
      <button onClick={handleCreateOrder}>Agregar Orden</button>
    </div>
  );
};
