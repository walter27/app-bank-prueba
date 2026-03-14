import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Modal } from './modal';
import { MessageStore, ModalStore } from '../../store';
import { ProductStore } from '../../product/store';

describe('Modal', () => {
  let component: Modal;
  let fixture: ComponentFixture<Modal>;
  let modalStore: ModalStore;
  let messageStore: MessageStore;
  let productStore: ProductStore;

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Modal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modal);
    component = fixture.componentInstance;
    modalStore = TestBed.inject(ModalStore);
    messageStore = TestBed.inject(MessageStore);
    productStore = TestBed.inject(ProductStore);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal and reset message state', () => {
    modalStore.setModalState({ open: true });
    messageStore.setMessageState({ success: true, message: 'ok', type: 'success', icon: true });

    component.onClose();
    expect(component.isClosing).toBe(true);

    jest.advanceTimersByTime(200);
    expect(modalStore.open()).toBe(false);
    expect(messageStore.success()).toBe(false);
    expect(messageStore.message()).toBe('');
  });

  it('should block close while submitting', () => {
    modalStore.setModalState({ open: true });
    productStore.setProductState({ isSubmitting: true });

    component.onClose();

    expect(component.isClosing).toBe(false);
    expect(modalStore.open()).toBe(true);
  });
});
