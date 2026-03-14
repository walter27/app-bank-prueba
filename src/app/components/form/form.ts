import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormStore } from '../../store';
import { FieldConfig } from '../../models/form.models';

@Component({
  selector: 'app-form',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private formStore = inject(FormStore);
  public form!: FormGroup;
  private fb = inject(FormBuilder);
  submitted = output<Record<string, unknown>>();

  fields = this.formStore.fields;
  sortedFields = computed(() =>
    [...this.fields()].sort((a, b) => {
      const rowA = a.row ?? Number.MAX_SAFE_INTEGER;
      const rowB = b.row ?? Number.MAX_SAFE_INTEGER;
      if (rowA !== rowB) {
        return rowA - rowB;
      }
      const columnA = a.column ?? Number.MAX_SAFE_INTEGER;
      const columnB = b.column ?? Number.MAX_SAFE_INTEGER;
      return columnA - columnB;
    }),
  );

  gridColumnCount = computed(() => {
    const maxColumn = this.fields().reduce((max, field) => Math.max(max, field.column ?? 1), 1);
    return Math.max(maxColumn, 1);
  });

  ngOnInit(): void {    
    const controls: Record<string, unknown> = {};
    this.fields().forEach((field: FieldConfig) => {
      controls[field.name] = [
        { value: field.value ?? '', disabled: !!field.disabled },
        field.validators ?? [],
        field.asyncValidators ?? [],
      ];
    });
    this.form = this.fb.group(controls);
  }

  submit(): boolean {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return false;
    }
    return true
  }

  hasError(name: string): boolean {
    const control = this.form.get(name);
    return !!(control && control.invalid && control.touched);
  }
}
