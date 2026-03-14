import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Table } from './table';
import { TableStore } from '../../store';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;
  let tableStore: TableStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    tableStore = TestBed.inject(TableStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render loading skeleton rows', () => {
    tableStore.setTableState({
      loading: true,
      columns: [{ key: 'name', label: 'Nombre' }],
      rows: [],
    });
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.table-skeleton-cell');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should fallback image source when image url is invalid', () => {
    const src = component.getImageSrc({ key: 'logo', type: 'image' }, { logo: 'no-es-url' });
    expect(src.startsWith('data:image/svg+xml')).toBe(true);
  });
});
