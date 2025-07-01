import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Variant } from '../interfaces/variant';

@Injectable({
  providedIn: 'root'
})
export class VariantService {

  constructor(private http: HttpClient) { }

  parse(variantInput) {
    const hgvsMatch = new RegExp('^[0-9a-zA-Z_\.]+:c\.[0-9]+(A|C|G|T)+>(A|C|G|T)+$')
      .exec(variantInput);
    const coordMatch = new RegExp(
        '^([cC]hr)?' +
        '(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y|M)' + '\\s*:\\s*' +
        '(?:g\.)?([0-9]+)' + '\\s*' +
        '([ACGT]+)' + '\\s*>\\s*' +
        '([ACGT]+)$'
      ).exec(variantInput);
    const coordGnomADMatch = new RegExp(
        '^(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y|M)-' +
        '([0-9]+)-' +
        '([ACGT]+)-' +
        '([ACGT]+)$'
      ).exec(variantInput);

    if (hgvsMatch) {
      return {
        valid: true,
        type: 'hgvs'
      };
    }
    if (coordMatch) {
      return {
        valid: true,
        type: 'coord',
        variant: {
          chr: coordMatch[2],
          pos: parseInt(coordMatch[3], 10),
          ref: coordMatch[4],
          alt: coordMatch[5]
        }
      };
    }
    if (coordGnomADMatch) {
      return {
        valid: true,
        type: 'coord',
        variant: {
          chr: coordGnomADMatch[1],
          pos: parseInt(coordGnomADMatch[2], 10),
          ref: coordGnomADMatch[3],
          alt: coordGnomADMatch[4]
        }
      };
    }
    return {
      valid: false,
      type: null,
      variant: null
    };
  }

  liftoverHg38ToHg19(variant: Variant): Observable<any> {
    const url = `${ environment.apiHost }/data/liftover/` +
      `hg38/chr/${ variant.chr }` +
      `/pos/${ variant.pos }/hg19`;
    return new Observable((obs) => {
      this.http.get(url)
        .pipe(take(1))
        .subscribe({
          next: (res: { hg19Chr?: string, hg19Pos?: number }) => {
            if (res.hg19Chr) {
              obs.next({
                success: true,
                data: {
                  chr: res.hg19Chr,
                  pos: res.hg19Pos,
                  ref: variant.ref,
                  alt: variant.alt,
                  build: 'hg38'
                }
              });
            } else {
              obs.next({
                success: false,
                error: {
                  message: 'Unmapped'
                }
              });
            }
          },
          error: (err) => {
            obs.error(err);
          }
        });
    });
  }
}
