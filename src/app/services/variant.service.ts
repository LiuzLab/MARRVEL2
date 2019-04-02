import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariantService {

  constructor() { }

  parse(variantInput) {
    const hgvsMatch = new RegExp('^[0-9a-zA-Z_\.]+:c\.[0-9]+(A|C|G|T)+>(A|C|G|T)+$')
      .exec(variantInput);
    const coordMatch = new RegExp(
        '^(Chr)?' +
        '(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|X|Y|M)' + '\\s*:\\s*' +
        '([0-9]+)' + '\\s*' +
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
          pos: parseInt(coordMatch[3]),
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
          pos: parseInt(coordGnomADMatch[2]),
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
}
