import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductContainer } from './productContainer';
import { ProductService } from './services/product-service';
import { FormStore, ModalStore } from '../store';
import { Product } from './models/product';

class ProductServiceStub {
  getProducts = jest.fn();
  addProduct = jest.fn();
  updateProduct = jest.fn();
  deleteProduct = jest.fn();
}

describe('ProductContainer', () => {
  let component: ProductContainer;
  let fixture: ComponentFixture<ProductContainer>;
  let modalStore: ModalStore;
  let formStore: FormStore;

  const sampleProduct: Product = {
    id: 1,
    name: 'Producto demo',
    description: 'Descripcion demo',
    logo: 'logo.png',
    dateRelease: '2026-01-01',
    dateRevision: '2027-01-01',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductContainer],
      providers: [{ provide: ProductService, useClass: ProductServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductContainer);
    component = fixture.componentInstance;
    modalStore = TestBed.inject(ModalStore);
    formStore = TestBed.inject(FormStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open add modal with form fields', () => {
    component.onAdd();

    expect(modalStore.open()).toBe(true);
    expect(modalStore.title()).toContain('Agregar');
    expect(formStore.fields().length).toBeGreaterThan(0);
  });

  it('should disable id field when editing', () => {
    component.onEdit(sampleProduct);

    const idField = formStore.fields().find((field) => field.name === 'id');
    expect(idField?.disabled).toBe(true);
  });
});
