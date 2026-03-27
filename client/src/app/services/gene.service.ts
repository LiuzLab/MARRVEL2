import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

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
    return this.http.get(url, { params });
  }
}
