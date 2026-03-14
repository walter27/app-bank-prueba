import { Product, ProductDto } from '../models/product';

export const productAdapter = (product: ProductDto): Product => {
  const { date_release, date_revision, ...rest } = product;
  return {
    ...rest,
    dateRelease: date_release,
    dateRevision: date_revision,
  };
};

export const productListAdapter = (productResponse: ProductDto[]): Product[] => {
  return productResponse.map((product) => productAdapter(product));
};

export const productRequestAdapter = (product: Product): ProductDto => {
  const { dateRelease, dateRevision, ...rest } = product;
  return {
    ...rest,
    date_release: dateRelease,
    date_revision: dateRevision,
  };
};
