import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSearch(searchText: string) {
    console.log(searchText);
    this.router.navigateByUrl(`/search/${searchText}`); //inner url řešené pomocí routing modulu
  }
}
