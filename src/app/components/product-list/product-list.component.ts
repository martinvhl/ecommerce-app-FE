import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  protected products: Product[] = [];
  protected currentCategoryId!: number; // potlačíme null, s proměnnou pracujeme jen když není null
  protected catNameSub!: Subscription;
  protected categoryName: string | undefined;
  searchMode: boolean = false;

  constructor(
    private productService: ProductService,
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
    return this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => (this.products = data));
  }

  handleSearchProducts() {
    const searchKeyword: string =
      this.route.snapshot.paramMap.get('searchText')!;
    
      this.productService.searchForProducts(searchKeyword).subscribe(data => this.products = data);
  }

  private listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('searchText'); //jméno parametru v routing-modulu/pomocí routeru v search komponentu
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  ngOnDestroy(): void {
    this.catNameSub.unsubscribe();
  }
}
