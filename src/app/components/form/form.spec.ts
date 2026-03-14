import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Form } from './form';
import { FormStore } from '../../store';

describe('Form', () => {
  let component: Form;
  let fixture: ComponentFixture<Form>;
  let formStore: FormStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Form]
    })
    .compileComponents();

    formStore = TestBed.inject(FormStore);
    formStore.setFormState({
      fields: [
        { name: 'id', label: 'ID', type: 'text', disabled: true },
        { name: 'name', label: 'Nombre', type: 'text' },
      ],
    });

    fixture = TestBed.createComponent(Form);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable id control when field is configured as disabled', () => {
    expect(component.form.get('id')?.disabled).toBe(true);
    expect(component.form.get('name')?.enabled).toBe(true);
  });
});
