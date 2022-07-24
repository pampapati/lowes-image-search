import { Component, OnDestroy, OnInit, VERSION } from '@angular/core';
import {
  BehaviorSubject,
  forkJoin,
  fromEvent,
  Observable,
  Subject,
} from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';
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
  currentPage: number = 1;
  destroy = new Subject();
  searchResultRecords: ISearchResult;
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  items$: Observable<any> = this.obsArray.asObservable();
  pageSize: number = 10;

  constructor(private apiService: ImageApiServce) {}
  ngOnDestroy(): void {
    this.destroy.complete();
    this.destroy.unsubscribe();
  }
  ngOnInit(): void {
    this.searchImages();
    this.getData();
  }
  searchImages() {
    if (this.searchQuery) {
      this.apiService
        .searchImages(this.searchQuery, this.currentPage, this.pageSize)
        .pipe(takeUntil(this.destroy))
        .subscribe((response: ISearchResult) => {
          this.searchResultRecords = response;
          this.obsArray.next(response.hits);
        });
    } else {
      this.searchResultRecords = null;
    }
  }

  private getData() {
    const content = document.querySelector('.list');
    const scroll$ = fromEvent(content!, 'scroll').pipe(
      map(() => {
        return content!.scrollTop;
      })
    );

    scroll$.subscribe((scrollPos) => {
      let limit = content!.scrollHeight - content!.clientHeight;
      console.log(limit, scrollPos);
      if (Math.round(scrollPos) === limit) {
        this.currentPage++;
        console.log('this.currentPage', this.currentPage);
        forkJoin([
          this.items$.pipe(take(1)),
          this.apiService.searchImages(
            this.searchQuery,
            this.currentPage,
            this.pageSize
          ),
        ]).subscribe((data: any) => {
          const newArr = [...data[0], ...data[1].hits];
          this.obsArray.next(newArr);
        });
      }
    });
  }
}
