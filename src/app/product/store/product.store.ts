import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

type ProductState = {
  products: Map<number, Product> | null;
  productSelected: Product | null;
  isLoadingList: boolean;
  isSubmitting: boolean;
};

const initialProductState: ProductState = {
  products: null,
  productSelected: null,
  isLoadingList: false,
  isSubmitting: false,
};

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly state = signal<ProductState>(initialProductState);

  readonly products = computed(() => this.state().products);
  readonly productsArray = computed(() => {
    const productsMap = this.state().products;
    return productsMap ? Array.from(productsMap.values()) : [];
  });
  readonly productSelected = computed(() => this.state().productSelected);
  readonly isLoadingList = computed(() => this.state().isLoadingList);
  readonly isSubmitting = computed(() => this.state().isSubmitting);


   setProductState(state: Partial<ProductState>): void {
    this.state.update((s) => ({ ...s, ...state }));
  }
}
