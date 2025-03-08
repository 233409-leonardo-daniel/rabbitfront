import { Product } from "../../features/product/domain/product";

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
}

export const ProductList = ({ products, isLoading }: ProductListProps) => {
  if (isLoading) {
    return <div className="products-loading">Cargando productos...</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No se encontraron productos</div>;
  }

  return (
    <div className="products-list-container">
      <h2>Productos</h2>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-header">
              <h3>{product.name}</h3>
              <p><strong>Precio:</strong> ${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
