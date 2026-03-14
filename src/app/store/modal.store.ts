import { computed, Injectable, signal } from '@angular/core';
import { FieldConfig } from '../models/form.models';

type ModalState = {
  modalMode: string;
  open: boolean;
  title: string;
};

const initialModalState: ModalState = {
  modalMode: '',
  open: false,
  title: '',
};


@Injectable({
  providedIn: 'root',
})
export class  ModalStore {
  private readonly state = signal<ModalState>(initialModalState);

  readonly modalMode = computed(() => this.state().modalMode);
  readonly open = computed(() => this.state().open);
  readonly title = computed(() => this.state().title);


  setModalState(state: Partial<ModalState>): void {
    this.state.update((s) => ({ ...s, ...state }));
  }
}
