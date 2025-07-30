import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { HumanGene } from '../interfaces/gene';

@Injectable({
  providedIn: 'root'
})
export class PpiService {

  constructor(private http: HttpClient) { }

  getString(entrezId: number): Observable< any > {
    return new Observable(observer => {
      this.http.get(`${environment.apiHost}/data/ppi/string/entrezId/${entrezId}`)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            observer.next(res);
            observer.complete();
          },
          error: (err) => {
            observer.error(err);
            observer.complete();
          }
        });
      });
  }
}
