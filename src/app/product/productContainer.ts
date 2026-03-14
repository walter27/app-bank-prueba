import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  OnInit,
  effect,
} from '@angular/core';
import { Table, TableColumn } from '../components/table/table';
import { Modal } from '../components/modal/modal';
import { Message } from '../components/message/message';
import { Form } from '../components/form/form';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { ProductStore } from './store';
import { ModalStore, MessageStore, FormStore, TableStore } from '../store';
import { PRODUCT_FORM_FIELDS } from './config/product-form.config';

@Component({
  standalone: true,
  selector: 'app-product',
  imports: [Table, Modal, Message, Form],
  templateUrl: './productContainer.html',
  styleUrl: './productContainer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductContainer implements OnInit {
  @ViewChild(Form) formComponent?: Form;

  readonly columns: TableColumn[] = [
    { key: 'logo', label: 'Logo', type: 'image' },
    { key: 'name', label: 'Nombre' },
    { key: 'description', label: 'Descripcion' },
    { key: 'dateRelease', label: 'Fecha de liberacion' },
    { key: 'dateRevision', label: 'Fecha de revision' },
    { key: 'id', label: 'ID' },
  ];

  private readonly httpService = inject(ProductService);
  private readonly productStore = inject(ProductStore);
  private readonly modalStore = inject(ModalStore);
  private readonly messageStore = inject(MessageStore);
  private readonly formStore = inject(FormStore);
  private readonly tableStore = inject(TableStore);

  readonly openModal = this.modalStore.open;
  readonly success = this.messageStore.success;
  readonly error = this.messageStore.error;
  readonly warning = this.messageStore.warning;
  readonly modalMode = this.modalStore.modalMode;
  readonly isLoadingList = this.productStore.isLoadingList;
  readonly isSubmitting = this.productStore.isSubmitting;

  constructor() {
    effect(() => {
      const pageSize = this.tableStore.pageSize();
      const loading = this.isLoadingList();
      this.tableStore.setTableState({ rows: this.getProductsSlice(pageSize), loading });
    });
  }

  ngOnInit(): void {
    this.tableStore.setTableState({
      rows: this.getProductsSlice(2),
      columns: this.columns,
      showToolbar: true,
      searchLabel: 'Buscar producto',
      searchPlaceholder: 'Search',
      addButtonLabel: 'Agregar',
      pageSizeOptions: [5, 10, 15],
      pageSize: 5,
      loading: false,
    });
  }

  onAdd(): void {
    this.productStore.setProductState({ productSelected: null });
    this.formStore.setFormState({ fields: PRODUCT_FORM_FIELDS });
    this.modalStore.setModalState({
      modalMode: 'form',
      open: true,
      title: 'Agregar nuevo producto',
    });
    this.messageStore.setMessageState({
      warning: false,
      success: false,
      error: false,
    });
  }

  onSearch(searchTerm: string): void {
    const search = searchTerm.toLowerCase();
    const products = new Map<number, Product>(this.productStore.products() ?? []);
    if (search.length === 0) {
      this.httpService.getProducts();
      return;
    }
    const resultado = [...products.entries()].filter(([_, product]) =>
      Object.values(product).join(' ').toLowerCase().includes(search),
    );
    const prductsFilter = new Map<number, Product>(resultado);
    this.productStore.setProductState({ products: prductsFilter });
  }

  onPageChange(size: number): void {
    this.tableStore.setTableState({ pageSize: size });
    this.httpService.getProducts();
  }

  onEdit(row: unknown): void {
    const product = row as Product;
    this.productStore.setProductState({ productSelected: product });
    this.modalStore.setModalState({
      modalMode: 'form',
      open: true,
      title: 'Editar producto',
    });
    this.messageStore.setMessageState({
      warning: false,
      success: false,
      error: false,
    });
    this.setFormFields(product);
  }

  onRemove(row: unknown): void {
    const product = row as Product;
    this.productStore.setProductState({ productSelected: product });
    this.modalStore.setModalState({
      title: 'Confirmar eliminación',
      modalMode: 'delete',
      open: true,
    });
    this.messageStore.setMessageState({
      type: 'warning',
      warning: true,
      success: false,
      error: false,
      icon: true,
      message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`,
    });
  }

  onModalConfirm(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.error() || this.success()) {
      this.modalStore.setModalState({ open: false });
      return;
    }

    if (this.modalStore.modalMode() === 'delete') {
      this.httpService.deleteProduct();
      return;
    }

    const isValid = this.formComponent?.submit() ?? false;
    if (!isValid) {
      return;
    }

    const productSelected = this.productStore.productSelected();
    const idValue = productSelected?.id;
    let product = { ...this.formComponent?.form.value } as Product;
    this.productStore.setProductState({ productSelected: product });
    idValue ? this.httpService.updateProduct() : this.httpService.addProduct();
  }

  private getProductsSlice(size: number): Product[] {
    const products = new Map<number, Product>(this.productStore.products() ?? []);
    const resultado = [...products.values()].slice(0, size);
    return resultado;
  }

  private setFormFields(product: Product | null): void {
    const fields = PRODUCT_FORM_FIELDS.map((field) => ({
      ...field,
      disabled: !!product && field.name === 'id',
      value: product ? ((product as unknown as Record<string, unknown>)[field.name] ?? '') : '',
    }));
    this.formStore.setFormState({ fields });
  }
}
