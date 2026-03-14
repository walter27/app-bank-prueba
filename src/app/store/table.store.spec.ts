import { TestBed } from '@angular/core/testing';
import { TableStore } from './table.store';

describe('TableStore', () => {
  let store: TableStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(TableStore);
  });

  it('should update table state', () => {
    store.setTableState({
      loading: true,
      rows: [{ id: 1 }],
      columns: [{ key: 'id', label: 'ID' }],
      pageSize: 5,
      pageSizeOptions: [5, 10],
      showToolbar: true,
      searchLabel: 'Buscar',
      searchPlaceholder: 'Search',
      addButtonLabel: 'Agregar',
    });

    expect(store.loading()).toBe(true);
    expect(store.rows().length).toBe(1);
    expect(store.columns().length).toBe(1);
    expect(store.pageSize()).toBe(5);
  });
});
