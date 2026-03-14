import { computed, Injectable, signal } from '@angular/core';
import { TableColumn } from '../components/table/table';

type TableState = {
  columns: TableColumn[];
  rows: unknown[];
  loading: boolean;
  pageSize: number;
  showToolbar: boolean;
  searchPlaceholder: string;
  searchLabel: string;
  addButtonLabel: string;
  pageSizeOptions: number[];
};

const initialTableState: TableState = {
  rows: [],
  columns: [],
  loading: false,
  pageSize: 0,
  pageSizeOptions: [],
  showToolbar: false,
  searchPlaceholder: '',
  searchLabel: '',
  addButtonLabel: '',
};

@Injectable({
  providedIn: 'root',
})
export class TableStore {
  private readonly state = signal<TableState>(initialTableState);

  readonly pageSize = computed(() => this.state().pageSize);
  readonly pageSizeOptions = computed(() => this.state().pageSizeOptions);
  readonly showToolbar = computed(() => this.state().showToolbar);
  readonly searchPlaceholder = computed(() => this.state().searchPlaceholder);
  readonly searchLabel = computed(() => this.state().searchLabel);
  readonly addButtonLabel = computed(() => this.state().addButtonLabel);
  readonly columns = computed(() => this.state().columns);
  readonly rows = computed(() => this.state().rows);
  readonly loading = computed(() => this.state().loading);

  setTableState(state: Partial<TableState>): void {
    this.state.update((s) => ({ ...s, ...state }));
  }
}
