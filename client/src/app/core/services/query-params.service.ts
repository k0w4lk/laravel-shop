import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class QueryParamsService {
  public queryParams$: Observable<Record<string, any>>;

  private queryParams = new BehaviorSubject<Record<string, any>>(null);

  constructor() {
    this.queryParams$ = this.queryParams.asObservable();
  }

  public setQueryParams(params: Record<string, any>): void {
    const currentParams = this.queryParams.value;

    this.queryParams.next({ ...currentParams, ...params });
  }

  public deleteQueryParams(keys: string[]): void {
    const currentParams = this.queryParams.value;
    const updatedParams: Record<string, any> = {};

    for (const key in currentParams) {
      if (!keys.includes(key)) {
        updatedParams[key] = currentParams[key];
      }
    }

    this.queryParams.next(updatedParams);
  }

  public buildQueryString() {
    const queryString = Object.entries(this.queryParams.value)
      .filter(pair => {
        return pair[1] !== null || pair[1] !== '';
      })
      .map(pair => {
        if (Array.isArray(pair[1])) {
          return pair[1].map(v => pair[0] + '=' + v).join('&');
        } else {
          return pair.join('=');
        }
      })
      .join('&');

    return queryString ? '?' + queryString : '';
  }
}
