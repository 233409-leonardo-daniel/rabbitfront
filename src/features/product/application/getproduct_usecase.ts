import { Product } from "../domain/product";
import { ProductRepository } from "../domain/product_repository";

export class GetProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        try {
            return await this.productRepository.getAll(); 
        } catch (error) {
            console.error('Error in GetProductUseCase:', error);
            return [];
        }
    }
}