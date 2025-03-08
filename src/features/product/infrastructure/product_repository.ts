import axios from 'axios';
import { Product } from "../domain/product";
import { ProductRepository } from "../domain/product_repository";

const API_URL = 'http://localhost:8080';

export class AxiosProductRepository implements ProductRepository {

    async getAll(): Promise<Product[]> {
        try {
          const response = await axios.get<Product[]>(`${API_URL}/products`);
          return response.data;
        } catch (error) {
          console.error('Error fetching orders:', error);
          return [];
        }
      }

}