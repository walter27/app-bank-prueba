import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Table } from './components/table/table';
import { Modal } from './components/modal/modal';
import { Message } from './components/message/message';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [Table, Modal, Message],
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Products { }
