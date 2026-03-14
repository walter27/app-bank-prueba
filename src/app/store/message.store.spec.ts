import { TestBed } from '@angular/core/testing';
import { MessageStore } from './message.store';

describe('MessageStore', () => {
  let store: MessageStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(MessageStore);
  });

  it('should update message state', () => {
    store.setMessageState({ success: true, message: 'ok', type: 'success', icon: true });

    expect(store.success()).toBe(true);
    expect(store.message()).toBe('ok');
    expect(store.type()).toBe('success');
    expect(store.icon()).toBe(true);
  });
});
