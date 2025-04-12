import { ProductDTO } from "../models/ProductDTO";
import { Product } from "../models/Product";

export class ProductRepository {
    async create(product: Product): Promise<ProductDTO | null> {
        const response = await fetch('http://localhost:8080/products', {
            method: 'POST',
            body: JSON.stringify({
                name: product.name,
                price: product.price
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        if (!response.ok) return null;

        const data: ProductDTO = await response.json();
        return data;
    }

    async getAll(): Promise<ProductDTO[]> {
        const response = await fetch('http://localhost:8080/products', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        if (!response.ok) return [];

        const data: ProductDTO[] = await response.json();
        return data.map(product => new ProductDTO(product.id, product.name, product.price));
    }

    async update(id: number, product: Product): Promise<ProductDTO | null> {
        const response = await fetch(`http://localhost:8080/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: product.name,
                price: product.price
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        if (!response.ok) return null;

        const data: ProductDTO = await response.json();
        return data;
    }

    async delete(id: number): Promise<boolean> {
        const response = await fetch(`http://localhost:8080/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })

        return response.ok;
    }
} 