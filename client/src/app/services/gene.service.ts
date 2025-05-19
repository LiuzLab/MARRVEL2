import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneService {

  constructor(private http: HttpClient) { }

  searchBySymbol(keyword: string, taxonId?: number): Observable<any> {
    const url = `${environment.apiHost}/data/gene/search`;
    const params: any = { symbol: keyword };
    if (taxonId) {
      params.taxonId = taxonId;
    }
    return new Observable((obs) => {
      this.http.get(url, { params })
        .pipe(take(1))
        .subscribe((res) => {
          obs.next(res);
          obs.complete();
        }, (err) => {
          obs.error(err);
          obs.complete();
        });
    });
  }
}
