import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, Signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.html',
})
export class Modal {

  productService = inject(ProductService);
  private formBuilder = inject(FormBuilder);
  modal: Signal<{ enabled: boolean, product: Product | undefined }> = computed(() => this.productService.getProductSelected());
  form = this.formBuilder.nonNullable.group({
    id: ['', {
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10)
      ]
    }],
    name: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],
    description: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200)
    ]],
    logo: ['', Validators.required],
    dateRelease: ['', [
      Validators.required,
      this.validateDateNow
    ]],
    dateRevision: ['', Validators.required],
  }, {
    validators: [this.validateDateBefore]
  });

  constructor() {
    effect(() => {
      if (this.modal().enabled && this.modal().product) {
        this.form.setValue({ ...this.modal().product!, id: this.modal().product!.id.toString() });
        this.form.controls.id.disable();
      } else {
        this.form.reset();
        this.form.controls.id.enable();
      }
    });
  }

  validateDateNow(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const [year, month, day] = control.value.split('-').map(Number);
    const dateSelected = new Date(year, month - 1, day);
    return dateSelected >= hoy ? null : { fechaMenorHoy: true };
  }

  validateDateBefore(group: AbstractControl): ValidationErrors | null {
    const liberacion = group.get('fechaLiberacion')?.value;
    const revision = group.get('fechaRevision')?.value;
    if (!liberacion || !revision) return null;
    const fechaLiberacion = new Date(liberacion);
    const fechaEsperada = new Date(fechaLiberacion);
    fechaEsperada.setFullYear(fechaEsperada.getFullYear() + 1);
    const fechaRevision = new Date(revision);
    return fechaRevision.toDateString() >= fechaEsperada.toDateString()
      ? null
      : { revisionNoEsUnAnioDespues: true };
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const product = this.productService.getProductSelected().product;
    (product) ? this.editProduct() : this.saveProduct();
  }

  saveProduct() {
    const product: any = { ...this.form.value };
    this.productService.addProduct(product);
    this.form.reset();
    this.productService.setProductSelected(undefined, false);
  }

  editProduct() {
    const product: any = { ...this.form.value };
    this.productService.updateProduct(product.id, product);
    this.form.reset();
    this.productService.setProductSelected(undefined, false);

  }

  close() {
    this.form.reset();
    this.productService.setProductSelected(undefined, false);
  }

}
