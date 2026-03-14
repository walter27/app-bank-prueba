import { computed, Injectable, signal } from '@angular/core';

type MessageState = {
  success: boolean;
  error: boolean;
  warning: boolean;
  message: string;
  type: string;
  icon: boolean;
};

const initialMessageState: MessageState = {
  success: false,
  error: false,
  warning: false,
  message: '',
  type: '',
  icon: false,
};

@Injectable({
  providedIn: 'root',
})
export class  MessageStore {
  private readonly state = signal<MessageState>(initialMessageState);

  readonly success = computed(() => this.state().success);
  readonly error = computed(() => this.state().error);
  readonly warning = computed(() => this.state().warning);
  readonly message = computed(() => this.state().message);
  readonly type = computed(() => this.state().type);
  readonly icon = computed(() => this.state().icon);

  setMessageState(state: Partial<MessageState>): void {
    this.state.update((s) => ({ ...s, ...state }));
  }
}
