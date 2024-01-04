import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environment';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

//_embedded - tvar odpovědi našeho REST API - implicitně vytvořené Spring Data REST - mohli bychom si na BE REST controller vytvořit sami, pak by response body bylo naše custom a to by se tady předělalo
interface GetResponse {
    _embedded: {
        products: Product[];
    }
}

@Injectable({providedIn: 'root'})
export class ProductService {
    private getProductsUrl = environment.getAllProductsUrl;

    constructor(private httpClient: HttpClient) {}

    getProductList(): Observable<Product[]> {
        return this.httpClient.get<GetResponse>(this.getProductsUrl).pipe(map(response => response._embedded.products));
    }
}