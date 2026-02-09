import { Component, computed, inject, Signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
})
export class Table {

  pages = [5, 10, 20];
  currentPage = 5;
  headers = ['Logo', 'Nombre del producto', 'Descripción', 'Fecha de liberación', 'Fecha de restauración', ''];

  productService = inject(ProductService);
  products: Signal<Product[] | undefined> = computed(() => this.productService.getFormattedProducts());

  deleteProduct(id: number, name: string) {
    this.productService.setMessage(true, `¿Estas seguro de eliminar el producto ${name}?`);
    this.productService.setProductSelected(id, false);
  }

  editProduct(id: number) {
    this.productService.setProductSelected(id, true);
  }

  addProduct() {
    this.productService.setProductSelected(undefined, true);
  }
  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;
    console.log(searchTerm);

    this.productService.searchProducts(searchTerm);
  }
  onPageChange(event: any) {
    const size = event.target.value;
    this.currentPage = parseInt(size);
    this.productService.setSlicedProducts(parseInt(size));
  }


}
