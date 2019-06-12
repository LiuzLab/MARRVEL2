import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { Variant } from '../interfaces/variant';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getGenesBySymbolPrefix(taxonId: number, prefix: string): Observable<any> {
    const url = `${environment.apiHost}/gene/taxonId/${taxonId}/prefix/${prefix}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/gene/taxonId/9606/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGeneByGenomicLocation(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/gene/chr/${variant.chr}/pos/${variant.pos}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getOMIMByMimNumber(mimNumber: string | number): Observable<any> {
    const url = `${environment.apiHost}/omim/mimNumber/${mimNumber}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getClinVarByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/clinVar/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGnomADGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/gnomAD/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGnomADVaraint(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/gnomAD/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getDbNSFP(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/dbNSFP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getDECIPHERByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/DECIPHER/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getDECIPHERDiseaseByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/DECIPHERDisease/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGeno2MPByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/Geno2MP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getGeno2MPByGeneEntrezId(entrezId: string | number): Observable< any > {
    const url = `${environment.apiHost}/Geno2MP/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getDGVByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/DGV/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getDGVByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/DGV/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getOrthologByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/diopt/ortholog/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getAlignmentByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/diopt/alignment/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }

  getBatchByArray(data): Observable< any > {
    const url = `${environment.apiHost}/batch/variants`;
    return new Observable(observer => {
      this.http.get(url, { params: { variants: data } }).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        throw err;
      });
    });
  }
}
