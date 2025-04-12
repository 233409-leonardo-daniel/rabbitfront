import { ProductDTO } from "../data/models/ProductDTO";
import { ProductRepository } from "../data/repository/ProductRepository";

export class GetProductsUseCase {
    productRepository: ProductRepository

    constructor() {
        this.productRepository = new ProductRepository()
    }

    async execute(): Promise<ProductDTO[]> {
        return await this.productRepository.getAll();
    }
} 