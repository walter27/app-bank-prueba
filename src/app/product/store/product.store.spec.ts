import { TestBed } from '@angular/core/testing';
import { ProductStore } from './product.store';

describe('ProductStore', () => {
  let store: ProductStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProductStore);
  });

  it('should update loading and selected product state', () => {
    store.setProductState({
      isLoadingList: true,
      isSubmitting: true,
      productSelected: {
        id: 1,
        name: 'Producto',
        description: 'Demo',
        logo: 'logo.png',
        dateRelease: '2026-01-01',
        dateRevision: '2027-01-01',
      },
    });

    expect(store.isLoadingList()).toBe(true);
    expect(store.isSubmitting()).toBe(true);
    expect(store.productSelected()?.id).toBe(1);
  });
});
