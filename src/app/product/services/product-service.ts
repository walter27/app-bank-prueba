import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductDto, ResponseDto } from '../models/product';
import { finalize, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { productAdapter, productListAdapter, productRequestAdapter } from '../adapters';
import { ProductStore } from '../store';
import { MessageStore } from '../../store';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private productStore = inject(ProductStore);
  private messageStore = inject(MessageStore);

  constructor() {
    this.getProducts();
  }

  getProducts(): void {
    const newProductsMap = new Map<number, Product>();
    this.productStore.setProductState({ isLoadingList: true });
    this.http
      .get<ResponseDto>(`${this.baseUrl}/products`)
      .pipe(map((response) => productListAdapter(response.data as ProductDto[])))
      .pipe(finalize(() => this.productStore.setProductState({ isLoadingList: false })))
      .subscribe((products) => {
        products.forEach((product: Product) => {
          newProductsMap.set(product.id, product);
        });
        this.productStore.setProductState({ products: newProductsMap });
      });
  }

  verifyProductId(id: string) {
    return this.http.get<boolean>(`${this.baseUrl}/products/verification/${encodeURIComponent(id)}`);
  }

  addProduct(): void {
    const productSelected = this.productStore.productSelected();
    if (!productSelected) {
      return;
    }
    const productDto = productRequestAdapter(productSelected);
    const products = new Map<number, Product>(this.productStore.products() ?? []);
    this.productStore.setProductState({ isSubmitting: true });
    this.http
      .post<ResponseDto>(`${this.baseUrl}/products`, productDto)
      .pipe(finalize(() => this.productStore.setProductState({ isSubmitting: false })))
      .subscribe(
      (response) => {
        const createdProduct = productAdapter(response.data as ProductDto);
        products.set(createdProduct.id, createdProduct);
        this.productStore.setProductState({ products });
        this.messageStore.setMessageState({
          icon: true,
          type: 'success',
          success: true,
          message: response.message,
        });
      },
      (err) => {
        this.messageStore.setMessageState({
          icon: true,
          type: 'error',
          error: true,
          message: err.error.message || 'Error adding product',
        });
      },
    );
  }

  updateProduct(): void {
    const productSelected = this.productStore.productSelected();
    const productDto = productRequestAdapter(productSelected!);
    const { id, ...body } = productDto;
    const products = new Map<number, Product>(this.productStore.products() ?? []);
    this.productStore.setProductState({ isSubmitting: true });
    this.http
      .put<ResponseDto>(`${this.baseUrl}/products/${id}`, body)
      .pipe(finalize(() => this.productStore.setProductState({ isSubmitting: false })))
      .subscribe(
      (response) => {
        const updatedProduct = productAdapter(response.data as ProductDto);
        updatedProduct.id = id;
        products.set(updatedProduct.id, updatedProduct);
        this.productStore.setProductState({ products });
        this.messageStore.setMessageState({
          icon: true,
          type: 'success',
          success: true,
          message: response.message,
        });
      },
      (err) => {
        this.messageStore.setMessageState({
          icon: true,
          type: 'error',
          error: true,
          message: err.error.message || 'Error updating product',
        });
      },
    );
  }

  deleteProduct(): void {
    const products = new Map<number, Product>(this.productStore.products() ?? []);
    const productSelected = this.productStore.productSelected();
    this.productStore.setProductState({ isSubmitting: true });
    this.http
      .delete<ResponseDto>(`${this.baseUrl}/products/${productSelected!.id}`)
      .pipe(finalize(() => this.productStore.setProductState({ isSubmitting: false })))
      .subscribe(
      (response) => {
        products.delete(productSelected!.id);
        this.productStore.setProductState({ products });
        this.messageStore.setMessageState({
          icon: true,
          type: 'success',
          success: true,
          message: response.message,
        });
      },
      (err) => {
        this.messageStore.setMessageState({
          icon: true,
          type: 'error',
          error: true,
          message: err.error.message || 'Error deleting product',
        });
      },
    );
  }
}
