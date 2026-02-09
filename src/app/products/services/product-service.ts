import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ResponseDto } from '../models/product';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { productAdapter, productRequestAdapter } from '../adapters';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl: string = environment.baseUrl
  private products: Product[] = [];
  private http = inject(HttpClient)
  private state = signal({ products: new Map<number, Product>() })
  private modal = signal({ enabled: false, product: undefined as Product | undefined })
  private message = signal({ enabled: false, text: '' })

  constructor() {
    this.getProducts();
    this.setSlicedProducts(5);
  }

  getFormattedProducts() {
    return Array.from(this.state().products.values());
  }

  setMessage(enabled: boolean, text: string) {
    this.message.set({ enabled, text });
  }

  getMessage() {
    return this.message();
  }

  setProductSelected(id: number | undefined, enabled: boolean) {
    this.modal.set({ enabled, product: this.state().products.get(id!) || undefined });
  }

  getProductSelected() {
    return this.modal();
  }

  setSlicedProducts(size: number) {
    const newProductsMap = new Map<number, Product>();
    this.products.slice(0, size).forEach((product: any) => {
      newProductsMap.set(product.id, product)
    })
    this.state.set({
      products: newProductsMap
    })
  }

  searchProducts(searchTerm: string) {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (searchTermLower.length === 0) {
      this.getProducts();
      return;
    }
    const products: Product[] = Array.from(this.state().products.values()).filter(product =>
      product.name.toLowerCase().includes(searchTermLower) ||
      product.description.toLowerCase().includes(searchTermLower) ||
      product.id.toString().includes(searchTermLower) ||
      product.dateRelease.toString().includes(searchTermLower) ||
      product.dateRevision.toString().includes(searchTermLower)
    );
    const newProductsMap = new Map<number, Product>();
    products.forEach((product: any) => {
      newProductsMap.set(product.id, product)
    })
    this.state.set({
      products: newProductsMap
    })
  }

  getProducts(): void {
    this.http
      .get<ResponseDto>(`${this.baseUrl}/products`)
      .pipe(map(response => productAdapter(response.data)))
      .subscribe((products) => {
        products.forEach((product: any) => {
          this.state().products.set(product.id, product)
        })
        this.state.set({
          products: this.state().products
        })
        this.products = [...products];
      })
  }


  addProduct(product: Product): void {
    const productDto = productRequestAdapter(product)
    this.http.post(`${this.baseUrl}/products`, productDto).subscribe(() => {
      this.state.update((state) => {
        state.products.set(product.id, product);
        return { products: state.products };
      });
    });
    this.getProducts
  }

  updateProduct(id: number, product: Product): void {
    const productDto = productRequestAdapter(product)
    this.http.put(`${this.baseUrl}/products/${id}`, productDto).subscribe(() => {
      this.state.update((state) => {
        state.products.set(product.id, product);
        return { products: state.products };
      });
    });
    this.getProducts();
  }

  deleteProduct(id: number): void {
    this.http
      .delete(`${this.baseUrl}/products/${id}`)
      .subscribe(() => {
        this.state.update((state) => {
          state.products.delete(id);
          return { products: state.products };
        });
      })
    this.getProducts();
  }
}
