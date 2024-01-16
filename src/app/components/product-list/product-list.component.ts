import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem } from 'src/app/model/cart-item.model';
import { Product } from 'src/app/model/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  protected products: Product[] = [];
  protected previousCategoryId: number = 2;
  protected currentCategoryId: number = 2; // potlačíme null, s proměnnou pracujeme jen když není null
  protected previousKeyword: string = "";
  protected catNameSub!: Subscription;
  protected categoryName: string | undefined;
  searchMode: boolean = false;
  
  //pagination properties:
  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
    ) {}
    
    //podobnost s @PostConstruct u Spring beany
    ngOnInit(): void {
      this.catNameSub = this.productService.activeCategory.subscribe(
        (name) => (this.categoryName = name)
        );
        this.route.paramMap.subscribe(() => {
          this.listProducts();
        });
      }
      
      handleListProducts() {
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id'); // parametr definovaný v routes
        if (hasCategoryId) {
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
          this.productService
          .getProductCategories()
          .subscribe(
            (data) =>
            (this.categoryName = data.at(
              this.currentCategoryId - 2
              )?.categoryName)
              );
            } else {
              //no category - default is 2
              this.currentCategoryId = 2;
              this.categoryName = 'Books';
            }
            
            //check if we have a different category than previous
            //Note: Angular will reuse a component if it is currently being used
            
            //if we have a different category id than previous then set thepageNumber back to 1 -> nová kategorie, nový seznam produktů - tak od začátku
            if (this.previousCategoryId != this.currentCategoryId) {
              this.thePageNumber = 1;
            }
            
            this.previousCategoryId = this.currentCategoryId;
            console.log(
              `currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumber}`
              );
              
              return this.productService
              .getProductListPaginate(
                this.currentCategoryId,
                this.thePageNumber - 1, // pagination je 1-based, Spring Data je 0-based
                this.thePageSize
                )
                .subscribe(this.processResults());
              }
              
              handleSearchProducts() {
                const searchKeyword: string =
      this.route.snapshot.paramMap.get('searchText')!;
      
      if (searchKeyword != this.previousKeyword) {
        this.thePageNumber = 1;
      }
      this.previousKeyword = searchKeyword;
      
      this.productService
      .searchForProductsPaginate(
        this.thePageNumber - 1,
        this.thePageSize,
        searchKeyword
        )
        .subscribe(this.processResults());
      }
      
      listProducts() {
        this.searchMode = this.route.snapshot.paramMap.has('searchText'); //jméno parametru v routing-modulu/pomocí routeru v search komponentu
        if (this.searchMode) {
          this.handleSearchProducts();
        } else {
          this.handleListProducts();
        }
      }
      
      updatePageSize(selectedSize: number) {
        this.thePageSize = selectedSize;
        this.listProducts();
      }

      onAddToCartHandle(product: Product) {
        const theCartItem = new CartItem(product); // CartItem má constructor nastavený aby bral jako argument produkt a rozebral si ho 
        this.cartService.addToCart(theCartItem);
      }
      
      //higher order function returning a function
      private processResults() {
        return (response: any) => {
          this.products = response._embedded.products;
          this.thePageSize = response.page.size;
          this.thePageNumber = response.page.number + 1;
          this.theTotalElements = response.page.totalElements;
        }
      }

  ngOnDestroy(): void {
    this.catNameSub.unsubscribe();
  }
}
