import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/model/product.model';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  protected products: Product[] = [];

  //podobnost s @PostConstruct u Spring beany
  ngOnInit(): void {
    this.listProducts();
  }

  constructor(private productService: ProductService) {}

  listProducts() {
    return this.productService.getProductList().subscribe(data => this.products = data);
  }

}
