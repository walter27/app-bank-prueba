import { computed, Injectable, signal } from '@angular/core';
import { FieldConfig } from '../models/form.models';

type FormState = {
  fields: FieldConfig[];
};

const initialFormState: FormState = {
  fields: [],
};

@Injectable({
  providedIn: 'root',
})
export class FormStore {
  private readonly state = signal<FormState>(initialFormState);

  readonly fields = computed(() => this.state().fields || []);

  setFormState(state: Partial<FormState>): void {
    this.state.update((s) => ({ ...s, ...state }));
  }
}
