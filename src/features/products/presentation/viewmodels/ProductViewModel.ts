import { makeAutoObservable, runInAction } from "mobx";
import { Product } from "../../data/models/Product";
import { CreateProductUseCase } from "../../domain/CreateProductUseCase";
import { GetProductsUseCase } from "../../domain/GetProductsUseCase";
import { UpdateProductUseCase } from "../../domain/UpdateProductUseCase";
import { DeleteProductUseCase } from "../../domain/DeleteProductUseCase";
import { ProductDTO } from "../../data/models/ProductDTO";

export class ProductViewModel {
    name: string = '';
    price: number = 0;
    error: string | null = null;
    isValid: boolean = false;
    products: ProductDTO[] = [];
    isLoading: boolean = false;
    selectedProduct: ProductDTO | null = null;
    createProductUseCase: CreateProductUseCase;
    getProductsUseCase: GetProductsUseCase;
    updateProductUseCase: UpdateProductUseCase;
    deleteProductUseCase: DeleteProductUseCase;

    constructor() {
        makeAutoObservable(this);
        this.createProductUseCase = new CreateProductUseCase();
        this.getProductsUseCase = new GetProductsUseCase();
        this.updateProductUseCase = new UpdateProductUseCase();
        this.deleteProductUseCase = new DeleteProductUseCase();
    }

    resetForm() {
        runInAction(() => {
            this.name = '';
            this.price = 0;
            this.error = null;
            this.isValid = false;
            this.selectedProduct = null;
        });
    }

    onChangeName(name: string) {
        runInAction(() => {
            this.name = name || '';
        });
    }

    onChangePrice(price: string) {
        runInAction(() => {
            this.price = Number(price) || 0;
        });
    }

    setSelectedProduct(product: ProductDTO | null) {
        runInAction(() => {
            this.selectedProduct = product;
            this.isValid = false;
            if (product) {
                this.name = product.name || '';
                this.price = product.price || 0;
            } else {
                this.resetForm();
            }
        });
    }

    async doCreateProduct() {
        this.error = null;
        this.isValid = false;
        
        if (this.name !== "" && this.price > 0) {
            let product = new Product(this.name, this.price);
            try {
                let data = await this.createProductUseCase.execute(product);
                runInAction(() => {
                    if (data != null) {
                        this.isValid = true;
                        this.loadProducts();
                    }
                });
            } catch (err: any) {
                runInAction(() => {
                    this.error = err.message || "Error al crear el producto";
                });
            }
        } else {
            this.error = "Todos los campos son requeridos y el precio debe ser mayor a 0";
        }
    }

    async doUpdateProduct() {
        this.error = null;
        this.isValid = false;
        
        if (this.selectedProduct && this.name !== "" && this.price > 0) {
            let product = new Product(this.name, this.price);
            try {
                let data = await this.updateProductUseCase.execute(this.selectedProduct.id, product);
                runInAction(() => {
                    if (data != null) {
                        this.loadProducts();
                        this.isValid = true;
                    }
                });
            } catch (err: any) {
                runInAction(() => {
                    this.error = err.message || "Error al actualizar el producto";
                });
            }
        } else {
            this.error = "Todos los campos son requeridos y el precio debe ser mayor a 0";
        }
    }

    async doDeleteProduct(id: number) {
        this.error = null;
        
        try {
            const success = await this.deleteProductUseCase.execute(id);
            runInAction(() => {
                if (success) {
                    this.loadProducts();
                } else {
                    this.error = "Error al eliminar el producto";
                }
            });
        } catch (err: any) {
            runInAction(() => {
                this.error = err.message || "Error al eliminar el producto";
            });
        }
    }

    async loadProducts() {
        runInAction(() => {
            this.isLoading = true;
            this.error = null;
        });

        try {
            const products = await this.getProductsUseCase.execute();
            runInAction(() => {
                this.products = products;
                console.log('Productos cargados:', products);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            runInAction(() => {
                this.error = 'Error al cargar los productos';
            });
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
} 