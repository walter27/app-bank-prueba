import { Component, inject } from '@angular/core';
import { MessageStore } from '../../store';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message {

  private messageStore = inject(MessageStore);

  readonly message = this.messageStore.message;
  readonly type = this.messageStore.type;
  readonly icon = this.messageStore.icon;

}
