import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FieldConfig } from '../../models/form.models';

function toDateOnly(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === 'string') {
    const parts = value.split('-').map((part) => Number(part));
    if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
      return null;
    }
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  return null;
}

function releaseDateTodayOrFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const releaseDate = toDateOnly(control.value);
    if (!releaseDate) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return releaseDate >= today ? null : { releaseDateBeforeToday: true };
  };
}

function revisionDateOneYearAfterReleaseValidator(releaseControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const revisionDate = toDateOnly(control.value);
    const releaseDate = toDateOnly(control.parent?.get(releaseControlName)?.value);

    if (!revisionDate || !releaseDate) {
      return null;
    }

    const expectedRevision = new Date(releaseDate);
    expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);

    return revisionDate.getTime() === expectedRevision.getTime()
      ? null
      : { revisionDateMustBeOneYearAfterRelease: true };
  };
}

export const PRODUCT_FORM_FIELDS: FieldConfig[] = [
  {
    name: 'id',
    label: 'ID',
    step: 1,
    row: 1,
    column: 1,
    type: 'text',
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
  },
  {
    name: 'description',
    label: 'Descripcion',
    step: 1,
    row: 2,
    column: 1,
    type: 'text',
    validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
  },
  {
    name: 'dateRelease',
    label: 'Fecha de liberacion',
    step: 1,
    row: 3,
    column: 1,
    type: 'date',
    validators: [Validators.required, releaseDateTodayOrFutureValidator()]
  },
  {
    name: 'name',
    label: 'Nombre',
    step: 1,
    row: 1,
    column: 2,
    type: 'text',
    validators: [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
  },
  {
    name: 'logo',
    label: 'Logo',
    step: 1,
    row: 2,
    column: 2,
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'dateRevision',
    label: 'Fecha de revision',
    step: 1,
    row: 3,
    column: 2,
    type: 'date',
    validators: [Validators.required, revisionDateOneYearAfterReleaseValidator('dateRelease')]
  }
];
