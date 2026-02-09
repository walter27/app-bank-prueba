import { Component, computed, inject, Signal } from '@angular/core';
import { ProductService } from '../../services/product-service';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
})
export class Message {

  private productService = inject(ProductService);
  message: Signal<{ enabled: boolean, text: string }> = computed(() => this.productService.getMessage());

  cancel() {
    this.productService.setMessage(false, '');
  }

  confirm() {
    const modal = this.productService.getProductSelected();
    if (modal.product) {
      this.productService.deleteProduct(modal.product.id);
      this.cancel();
    }
  }


}
