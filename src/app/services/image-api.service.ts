import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchResult } from '../interfaces/image-response';

@Injectable({
  providedIn: 'root',
})
export class ImageApiServce {
  private ImageSearchURL = 'https://pixabay.com/api/';
  private PixabayAPIKEY = '28813639-7aa910c365d7ff9fec335f021';
  constructor(private httpClient: HttpClient) {}

  searchImages(
    query: string,
    page: number,
    pageSize: number
  ): Observable<ISearchResult> {
    let params = new HttpParams()
      .set('page', page)
      .set('per_page', pageSize)
      .set('key', this.PixabayAPIKEY)
      .set('q', query);
    return this.httpClient.get<ISearchResult>(this.ImageSearchURL, { params });
  }
}
