import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getGenesBySymbolPrefix(taxonId: number, prefix: string): Observable<any> {
    const url = `${environment.apiHost}/gene/taxonId/${taxonId}/prefix/${prefix}`;
    return Observable.create(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/gene/taxonId/9606/entrezId/${entrezId}`;
    return Observable.create(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getOMIMByMimNumber(mimNumber: string | number): Observable<any> {
    const url = `${environment.apiHost}/omim/mimNumber/${mimNumber}`;
    return Observable.create(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getClinVarByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/clinVar/entrezId/${entrezId}`;
    return Observable.create(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }
}
