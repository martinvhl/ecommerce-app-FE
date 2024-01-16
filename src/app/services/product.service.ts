import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/environment/environment';
import { ProductCategory } from '../model/product-category.model';
import { Product } from '../model/product.model';

//_embedded - vychází z tvaru odpovědi našeho REST API - implicitně vytvořené Spring Data REST - mohli bychom si na BE REST controller vytvořit sami, pak by response body bylo naše custom a to by se tady předělalo
//vedle _embedded s daty zde lze nalézt také page s informacemi o db (nastavená velikost - size, totalElements, totalPages, number - číslo stránky) a také _links s HATEOAS linky - první, předchozí, současná,následující a poslední stránka
interface GetProductResponse {
  _embedded: {
    products: Product[];
  };
  page: {
    size: number;
    totalElements: number; //gran total of all eles
    totalPages: number;
    number: number; //currPageNum
  };
}

interface GetProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  activeCategory: Subject<string> = new Subject<string>();
  activeCategoryId!: number;

  constructor(private httpClient: HttpClient) {}

  getProduct(productId: number): Observable<Product> {
    const customUrl = `${environment.baseProductAPIUrl}/${productId}`;
    return this.httpClient.get<Product>(customUrl); // auto-unwrap JSON objektu - built-in feature Spring Data REST, no config required
  }

  getProductListPaginate(
    categoryId: number,
    thePage: number,
    thePageSize: number
  ): Observable<GetProductResponse> {
    this.activeCategoryId = categoryId;
    const customUrl = `${environment.baseProductAPIUrl}${environment.findByCategory}${categoryId}&size=${thePageSize}&page=${thePage}`;
    console.log(customUrl);
    return this.httpClient.get<GetProductResponse>(customUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {
    this.activeCategoryId = categoryId;
    const customUrl = `${environment.baseProductAPIUrl}${environment.findByCategory}${categoryId}`;
    return this.getProducts(customUrl);
  }

  searchForProducts(keyword: string): Observable<Product[]> {
    const customUrl = `${environment.baseProductAPIUrl}${environment.searchByNameOrDesc}${keyword}`;
    return this.getProducts(customUrl);
  }

  searchForProductsPaginate(thePage: number, thePageSize: number, keyword: string): Observable<GetProductResponse> {
    const customUrl = `${environment.baseProductAPIUrl}${environment.searchByNameOrDesc}${keyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetProductResponse>(customUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetProductCategoryResponse>(environment.baseProductCategoriesUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  sendCategory(name: string) {
    this.activeCategory.next(name);
  }

  private getProducts(customUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetProductResponse>(customUrl)
      .pipe(map((response) => response._embedded.products));
  }
}
