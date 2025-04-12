import { ProductRepository } from "../data/repository/ProductRepository";

export class DeleteProductUseCase {
    productRepository: ProductRepository

    constructor() {
        this.productRepository = new ProductRepository()
    }

    async execute(id: number): Promise<boolean> {
        return await this.productRepository.delete(id);
    }
} 