import { Product, ProductDto } from "../models/product"

export const productAdapter = (productResponse: ProductDto[]) => {
    return productResponse.map(product => {
        const { date_release, date_revision, ...rest } = product;
        return {
            ...rest,
            dateRelease: product.date_release,
            dateRevision: product.date_revision
        };
    });
}

export const productRequestAdapter = (product: Product): ProductDto => {
    const { dateRelease, dateRevision, ...rest } = product;
    return {
        ...rest,
        date_release: product.dateRelease,
        date_revision: product.dateRevision
    }
}