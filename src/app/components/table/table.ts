import { Component, HostListener, inject, output } from '@angular/core';
import { TableStore } from '../../store';

export type TableColumnType = 'text' | 'image';

export interface TableColumn {
  key: string;
  label?: string;
  type?: TableColumnType;
  renderer?: (value: unknown, row: unknown) => string;
}

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class Table {
  private readonly defaultImageSrc =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%23f1f5f9'/%3E%3Cpath d='M18 44l10-12 8 9 6-7 8 10H18z' fill='%2394a3b8'/%3E%3Ccircle cx='24' cy='24' r='5' fill='%23cbd5e1'/%3E%3C/svg%3E";

  private tableStore = inject(TableStore);

  readonly rows = this.tableStore.rows;
  readonly columns = this.tableStore.columns;
  readonly pageSizes = this.tableStore.pageSizeOptions;
  readonly currentPageSize = this.tableStore.pageSize;
  readonly loading = this.tableStore.loading;
  readonly showToolbar = this.tableStore.showToolbar;
  readonly searchPlaceholder = this.tableStore.searchPlaceholder;
  readonly searchLabel = this.tableStore.searchLabel;
  readonly addButtonLabel = this.tableStore.addButtonLabel;

  readonly edit = output<unknown>();
  readonly remove = output<unknown>();
  readonly pageChange = output<number>();
  readonly search = output<string>();
  readonly add = output<void>();
  openActionsRow: number | null = null;
  readonly skeletonRows = Array.from({ length: 5 });

  onEdit(row: unknown): void {
    this.edit.emit(row);
  }

  onDelete(row: unknown): void {
    this.remove.emit(row);
  }

  onPageChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.pageChange.emit(parseInt(value, 10));
  }

  onSearch(search: string): void {
    this.search.emit(search!.toString());
  }

  onAdd(): void {
    this.add.emit();
  }

  onActionChange(event: Event, row: unknown): void {
    const select = event.target as HTMLSelectElement;
    const action = select.value;

    if (action === 'edit') {
      this.onEdit(row);
    }

    if (action === 'remove') {
      this.onDelete(row);
    }

    select.value = '';
  }

  toggleActions(rowIndex: number, event: Event): void {
    event.stopPropagation();
    this.openActionsRow = this.openActionsRow === rowIndex ? null : rowIndex;
  }

  onActionEdit(row: unknown): void {
    this.onEdit(row);
    this.openActionsRow = null;
  }

  onActionDelete(row: unknown): void {
    this.onDelete(row);
    this.openActionsRow = null;
  }

  onActionMenuClick(event: Event): void {
    event.stopPropagation();
  }

  @HostListener('document:click')
  closeActions(): void {
    this.openActionsRow = null;
  }

  getCellValue(row: unknown, column: string): unknown {
    if (!row || typeof row !== 'object') {
      return undefined;
    }

    return (row as Record<string, unknown>)[column];
  }

  formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  formatCell(column: TableColumn, row: unknown): string {
    const value = this.getCellValue(row, column.key);

    if (column.renderer) {
      return column.renderer(value, row);
    }

    return this.formatValue(value);
  }

  getImageSrc(column: TableColumn, row: unknown): string {
    const value = this.getCellValue(row, column.key);
    const candidate = column.renderer ? column.renderer(value, row) : value;

    if (typeof candidate === 'string' && this.isImageUrl(candidate)) {
      return candidate;
    }

    return this.defaultImageSrc;
  }

  onImageError(event: Event): void {
    const imageElement = event.target as HTMLImageElement;
    if (imageElement.src !== this.defaultImageSrc) {
      imageElement.src = this.defaultImageSrc;
    }
  }

  private isImageUrl(value: string): boolean {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return false;
    }

    if (trimmedValue.startsWith('data:image/')) {
      return true;
    }

    try {
      const parsedUrl = new URL(trimmedValue);
      const allowedProtocols = ['http:', 'https:'];
      if (!allowedProtocols.includes(parsedUrl.protocol)) {
        return false;
      }

      const path = parsedUrl.pathname.toLowerCase();
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.ico', '.avif'];
      return imageExtensions.some((extension) => path.endsWith(extension));
    } catch {
      return false;
    }
  }
}
