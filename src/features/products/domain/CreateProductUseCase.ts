import { ProductDTO } from "../data/models/ProductDTO";
import { Product } from "../data/models/Product";
import { ProductRepository } from "../data/repository/ProductRepository";

export class CreateProductUseCase {
    productRepository: ProductRepository

    constructor() {
        this.productRepository = new ProductRepository()
    }

    async execute(product: Product): Promise<ProductDTO | null> {
        const response: ProductDTO | null = await this.productRepository.create(product)
        
        var data = null
        if (response != null)
            data = new ProductDTO(response.id, response.name, response.price)
        
        return data;
    }
} 