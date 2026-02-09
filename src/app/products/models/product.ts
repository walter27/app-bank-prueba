export interface Product {
    id: number;
    name: string;
    description: string;
    logo: string;
    dateRelease : string;
    dateRevision : string;
}

export interface ResponseDto {
    data: ProductDto[];
    message: string;
}

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
}