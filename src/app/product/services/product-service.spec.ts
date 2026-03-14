import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProductService } from './product-service';
import { environment } from '../../../environments/environment.development';
import { ProductStore } from '../store';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let productStore: ProductStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    productStore = TestBed.inject(ProductStore);

    const initReq = httpMock.expectOne(`${environment.baseUrl}/products`);
    initReq.flush({ data: [], message: 'ok' });
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products into product store', () => {
    service.getProducts();

    const req = httpMock.expectOne(`${environment.baseUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush({
      data: [
        {
          id: 1,
          name: 'Cuenta',
          description: 'Producto bancario',
          logo: 'https://example.com/logo.png',
          date_release: '2026-01-01',
          date_revision: '2027-01-01',
        },
      ],
      message: 'ok',
    });

    expect(productStore.products()?.size).toBe(1);
    expect(productStore.isLoadingList()).toBe(false);
  });
});
