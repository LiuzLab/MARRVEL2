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
    prefix = prefix.replace(/\s+/g, ' ');
    const url = `${environment.apiHost}/data/gene/taxonId/${taxonId}/prefix/${prefix}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/gene/taxonId/9606/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGenomLocByHgvsVar(hgvsVariant: string): Observable< any > {
    const url = `${environment.apiHost}/data/mutalyzer/hgvs/${hgvsVariant}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGeneByGenomicLocation(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/data/gene/chr/${variant.chr}/pos/${variant.pos}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGenomLocByProteinVar(protein): Observable< any > {
    const url = `${environment.apiHost}/data/transvar/protein/${protein}`;
    return new Observable(observer => {
      this.http.get(url)
        .subscribe((res) => {
          observer.next(res);
        }, err => {
          observer.error(err);
        });
    });
  }

  getOMIMByMimNumber(mimNumber: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/omim/mimNumber/${mimNumber}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getClinVarByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/clinVar/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGnomADGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/gnomAD/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGnomADVaraint(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/gnomAD/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDbNSFP(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/dbNSFP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDECIPHERByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/data/DECIPHER/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDECIPHERByGenomLoc(hg19Chr: string, hg19Start: number, hg19Stop: number): Observable< any > {
    const url = `${environment.apiHost}/data/DECIPHER/genomloc/${hg19Chr}/${hg19Start}/${hg19Stop}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDECIPHERDiseaseByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/data/DECIPHERDisease/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDECIPHERDiseaseByGenomLoc(hg19Chr: string, hg19Start: number, hg19Stop: number): Observable< any > {
    const url = `${environment.apiHost}/data/DECIPHERDisease/genomloc/${hg19Chr}/${hg19Start}/${hg19Stop}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGeno2MPByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/data/Geno2MP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGeno2MPByGeneEntrezId(entrezId: string | number): Observable< any > {
    const url = `${environment.apiHost}/data/Geno2MP/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDGVByVariant(variant: Variant): Observable< any > {
    const url = `${environment.apiHost}/data/DGV/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDGVByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/DGV/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGtexByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/gtex/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getAgrExpByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/expression/orthologs/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getOrthologByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/diopt/ortholog/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getAlignmentByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/diopt/alignment/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getBatchByArray(data): Observable< any > {
    const url = `${environment.apiHost}/data/batch/variants`;
    return new Observable(observer => {
      this.http.get(url, { params: { variants: data } }).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getGeneBatchByArray(data): Observable< any > {
    const url = `${environment.apiHost}/data/batch/genes`;
    return new Observable(observer => {
      this.http.get(url, { params: { entrezIds: data.map(d => d.entrezId) } })
        .subscribe((res) => {
          observer.next(res);
        }, err => {
          observer.error(err);
        });
    });
  }

  getPharosTargetsByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/pharos/targets/gene/entrezId/${entrezId}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getPdbeSummaryByEntrezId(entrezId: number | string): Observable< any > {
    const url = `${environment.apiHost}/data/gene/entrezId/${entrezId}/pdbe/structure`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res) => {
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }
}
