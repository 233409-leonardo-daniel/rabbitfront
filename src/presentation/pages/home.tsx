import React, { useEffect, useState } from 'react';
import { NewOrder } from '../components/neworder';
import { Product } from '../../features/product/domain/product';
import { Order } from '../../features/order/domain/order';
import { AxiosProductRepository } from '../../features/product/infrastructure/product_repository';
import { GetProductUseCase } from '../../features/product/application/getproduct_usecase';
import { AxiosOrderRepository } from '../../features/order/infrastructure/order_repository';
import { CreateOrderUseCase } from '../../features/order/application/createorder_usecase';
import './home.css'; // Asegúrate de importar el CSS

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showOrderSection, setShowOrderSection] = useState<boolean>(false); // Estado para mostrar/ocultar la sección de agregar orden
  
  useEffect(() => {
    const fetchProducts = async () => {
      const productRepository = new AxiosProductRepository();
      const getProductUseCase = new GetProductUseCase(productRepository);
      
      try {
        const data = await getProductUseCase.execute();
        setProducts(data); 
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateOrder = async (order: Order) => {
    const orderRepository = new AxiosOrderRepository();
    const createOrderUseCase = new CreateOrderUseCase(orderRepository);
    
    try {
      const newOrder = await createOrderUseCase.execute(order);
      console.log('Orden creada:', newOrder);
      // Aquí puedes agregar lógica adicional, como actualizar el estado o mostrar un mensaje
    } catch (error) {
      console.error('Error al crear la orden:', error);
    }
  };

  return (
    <div className="home-container">
      <h1 className="header">Bienvenido a la Página de Inicio</h1>
      <button 
        className="add-order-button" 
        onClick={() => setShowOrderSection(!showOrderSection)} // Alternar la visibilidad de la sección de agregar orden
      >
        {showOrderSection ? 'Ocultar Agregar Orden' : 'Agregar Orden'}
      </button>
      
      {showOrderSection && ( // Mostrar la sección solo si showOrderSection es true
        <div className="order-section">
          <NewOrder products={products} onCreateOrder={handleCreateOrder} />
        </div>
      )}
      
      <div className="product-list">
        {products.map(product => (
          <div className="card" key={product.id}>
            <h2>{product.name}</h2>
            <p>Precio: ${product.price}</p>
            {/* Aquí puedes agregar más detalles del producto si lo deseas */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
