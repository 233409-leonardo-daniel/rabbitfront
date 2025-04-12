import  { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { ProductViewModel } from '../viewmodels/ProductViewModel';
import './ProductManagementView.css';

interface ProductManagementViewProps {
  viewModel: ProductViewModel;
}

export const ProductManagementView = observer(({ viewModel }: ProductManagementViewProps) => {
  useEffect(() => {
    viewModel.loadProducts();
  }, [viewModel]);

  const handleCreateProduct = async () => {
    await viewModel.doCreateProduct();
  };

  return (
    <div className="container">
      <h1 className="header">Gestión de Productos</h1>
      <input
        type="text"
        className="input"
        placeholder="Nombre del producto"
        value={viewModel.name}
        onChange={(e) => viewModel.onChangeName(e.target.value)}
      />
      <input
        type="number"
        className="input"
        placeholder="Precio"
        value={viewModel.price}
        onChange={(e) => viewModel.onChangePrice(e.target.value)}
      />
      <button className="button" onClick={handleCreateProduct}>Agregar Producto</button>
      {viewModel.error && <p className="error">{viewModel.error}</p>}
      <ul className="product-list">
        {viewModel.products.map((product) => (
          <li key={product.id} className="product-item">
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  );
});
