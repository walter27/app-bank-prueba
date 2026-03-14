import { TestBed } from '@angular/core/testing';
import { FormStore } from './form.store';

describe('FormStore', () => {
  let store: FormStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(FormStore);
  });

  it('should set form fields', () => {
    store.setFormState({
      fields: [{ name: 'id', label: 'ID', type: 'text' }],
    });

    expect(store.fields().length).toBe(1);
    expect(store.fields()[0].name).toBe('id');
  });
});
