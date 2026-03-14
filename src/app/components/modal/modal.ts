import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { ModalStore, MessageStore } from '../../store';
import { ProductStore } from '../../product/store';


@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  private readonly closeAnimationMs = 180;
  private modalStore = inject(ModalStore);
  private messageStore = inject(MessageStore);
  private productStore = inject(ProductStore);
  isClosing = false;

  saved = output<void>();
  confirm = output<void>();
  
  readonly open = this.modalStore.open;
  readonly title = this.modalStore.title;
  readonly isSubmitting = this.productStore.isSubmitting;

  onClose() {
    if (this.isSubmitting()) {
      return;
    }

    if (this.isClosing) {
      return;
    }

    this.isClosing = true;

    setTimeout(() => {
      this.modalStore.setModalState({ open: false });
      this.messageStore.setMessageState({
        success: false,
        error: false,
        warning: false,
        message: '',
        type: '',
        icon: false,
      });
      this.isClosing = false;
    }, this.closeAnimationMs);
  }

  onConfirm() {
    if (this.isSubmitting()) {
      return;
    }
    this.confirm.emit();
  }
}
