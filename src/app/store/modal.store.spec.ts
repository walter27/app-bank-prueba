import { TestBed } from '@angular/core/testing';
import { ModalStore } from './modal.store';

describe('ModalStore', () => {
  let store: ModalStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ModalStore);
  });

  it('should update modal state', () => {
    store.setModalState({ open: true, title: 'Modal', modalMode: 'form' });

    expect(store.open()).toBe(true);
    expect(store.title()).toBe('Modal');
    expect(store.modalMode()).toBe('form');
  });
});
