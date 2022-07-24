import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ISearchResult } from './interfaces/image-response';
import { ImageApiServce } from './services/image-api.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  searchBoxPlaceHolder = 'Enter your query to search';
  searchQuery;
  currentPage = 1;
  perPage = 3;
  destroy = new Subject();
  searchResultRecords: ISearchResult;

  constructor(private apiService: ImageApiServce) {}
  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }
  ngOnInit(): void {}
  searchImages() {
    if (this.searchQuery) {
      this.apiService
        .searchImages(this.searchQuery, this.currentPage, this.perPage)
        .pipe(takeUntil(this.destroy))
        .subscribe((response: ISearchResult) => {
          this.searchResultRecords = response;
        });
    } else {
      this.searchResultRecords = null;
    }
  }
}
