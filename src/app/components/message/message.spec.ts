import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Message } from './message';
import { MessageStore } from '../../store';

describe('Message', () => {
  let component: Message;
  let fixture: ComponentFixture<Message>;
  let messageStore: MessageStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Message],
    }).compileComponents();

    fixture = TestBed.createComponent(Message);
    component = fixture.componentInstance;
    messageStore = TestBed.inject(MessageStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render message text from store', () => {
    messageStore.setMessageState({ message: 'Operacion completada', type: 'success', icon: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Operacion completada');
  });
});
