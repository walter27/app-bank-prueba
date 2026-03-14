import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ProductContainer } from './productContainer';
import { ProductService } from './services/product-service';
import { Product } from './models/product';

class ProductServiceStub {
  private readonly products = signal<Product[]>([]);
  private readonly modal = signal({ enabled: false, product: undefined as Product | undefined });
  private readonly deleteModal = signal({ enabled: false, product: undefined as Product | undefined });
  private readonly deleteStatus = signal<'idle' | 'success' | 'error'>('idle');

  readonly deleteProduct = jasmine.createSpy('deleteProduct');

  setProducts(products: Product[]): void {
    this.products.set(products);
  }

  getFormattedProducts(): Product[] {
    return this.products();
  }

  getProductSelected() {
    return this.modal();
  }

  setProductSelected(id: number | undefined, enabled: boolean): void {
    const product = this.products().find((item) => item.id === id);
    this.modal.set({ enabled, product });
  }

  getDeleteSelected() {
    return this.deleteModal();
  }

  setDeleteSelected(id: number | undefined, enabled: boolean): void {
    if (!enabled) {
      this.deleteModal.set({ enabled: false, product: undefined });
      return;
    }

    const product = this.products().find((item) => item.id === id);
    if (!product) {
      this.deleteModal.set({ enabled: false, product: undefined });
      return;
    }

    this.deleteModal.set({ enabled: true, product });
  }

  clearDeleteSelection(): void {
    this.deleteModal.set({ enabled: false, product: undefined });
  }

  getDeleteStatus() {
    return this.deleteStatus();
  }

  setDeleteState(state: { enabled: boolean; product?: Product }): void {
    this.deleteModal.set({ enabled: state.enabled, product: state.product });
  }

  searchProducts(): void {}
  setSlicedProducts(): void {}
}

describe('ProductContainer', () => {
  let component: ProductContainer;
  let fixture: ComponentFixture<ProductContainer>;
  let productService: ProductServiceStub;

  const sampleProduct: Product = {
    id: 1,
    name: 'Producto demo',
    description: 'Descripcion demo',
    logo: 'logo.png',
    dateRelease: '2024-01-01',
    dateRevision: '2025-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductContainer],
      providers: [{ provide: ProductService, useClass: ProductServiceStub }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductContainer);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as unknown as ProductServiceStub;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens delete modal with product name on remove', () => {
    productService.setProducts([sampleProduct]);

    component.onRemove(sampleProduct);
    fixture.detectChanges();

    const deleteState = productService.getDeleteSelected();
    expect(deleteState.enabled).toBeTrue();
    expect(deleteState.product?.name).toBe(sampleProduct.name);

    const nameElement = fixture.nativeElement.querySelector('.delete-confirm-product');
    expect(nameElement?.textContent).toContain(sampleProduct.name);
  });

});
