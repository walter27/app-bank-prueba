import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product-service';
import { Product } from '../models/product';
import { environment } from '../../../environments/environment.development';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const flushInitialProducts = () => {
    const req = httpMock.expectOne(`${environment.baseUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], message: '' });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    flushInitialProducts();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('opens delete modal when valid product is selected', () => {
    const product: Product = {
      id: 10,
      name: 'Cuenta ahorro',
      description: 'Producto de prueba',
      logo: 'logo.png',
      dateRelease: '2024-01-01',
      dateRevision: '2025-01-01',
    };

    service['state'].set({ products: new Map([[product.id, product]]) });

    service.setDeleteSelected(product.id, true);

    const deleteState = service.getDeleteSelected();
    expect(deleteState.enabled).toBeTrue();
    expect(deleteState.product).toEqual(product);
  });

  it('does not open delete modal for invalid product id', () => {
    service.setDeleteSelected(999, true);

    const deleteState = service.getDeleteSelected();
    expect(deleteState.enabled).toBeFalse();
    expect(deleteState.product).toBeUndefined();
  });

  it('clears delete selection state', () => {
    const product: Product = {
      id: 11,
      name: 'Cuenta corriente',
      description: 'Producto de prueba',
      logo: 'logo.png',
      dateRelease: '2024-01-01',
      dateRevision: '2025-01-01',
    };

    service['state'].set({ products: new Map([[product.id, product]]) });

    service.setDeleteSelected(product.id, true);
    service.clearDeleteSelection();

    const deleteState = service.getDeleteSelected();
    expect(deleteState.enabled).toBeFalse();
    expect(deleteState.product).toBeUndefined();
  });
});
