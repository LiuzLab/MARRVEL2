import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Variant } from '../interfaces/variant';
import { HumanGene } from '../interfaces/gene';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getGenesBySymbolPrefix(taxonId: number, prefix: string): Observable<any> {
    prefix = prefix.replace(/\s+/g, ' ');
    const url = `${environment.apiHost}/data/gene/taxonId/${taxonId}/prefix/${prefix}`;
    return this.http.get(url);
  }

  getGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/gene/taxonId/9606/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getGenomLocByHgvsVar(hgvsVariant: string): Observable<any> {
    const url = `${environment.apiHost}/data/mutalyzer/hgvs/${hgvsVariant}`;
    return this.http.get(url);
  }

  getGeneByGenomicLocation(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/gene/chr/${variant.chr}/pos/${variant.pos}`;
    return this.http.get(url);
  }

  getGenomLocByProteinVar(protein): Observable<any> {
    const url = `${environment.apiHost}/data/transvar/protein/${protein}`;
    return this.http.get(url);
  }

  getOMIMByMimNumber(mimNumber: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/omim/mimNumber/${mimNumber}`;
    return this.http.get(url);
  }

  getClinVarByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/clinVar/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getGnomADGeneByEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/gnomAD/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getGnomADVaraint(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/gnomAD/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}?build=${variant.build || 'hg19'}`;
    return new Observable(observer => {
      this.http.get(url).subscribe((res: any) => {
        res = res || {};
        res.exome = res.exome || {};
        res.genome = res.genome || {};
        res.exome.alleleNum = res.exome.alleleNum || res.exome.alleleNumber;
        res.genome.alleleNum = res.genome.alleleNum || res.genome.alleleNumber;
        res.exome.alleleFreq = res.exome.alleleNum ? res.exome.alleleCount / res.exome.alleleNum : undefined;
        res.genome.alleleFreq = res.genome.alleleNum ? res.genome.alleleCount / res.genome.alleleNum : undefined;
        if (res.exome.alleleNum || res.genome.alleleNum) {
          res.total = {
            alleleNum: (res.exome.alleleNum || 0) + (res.genome.alleleNum || 0),
            alleleCount: (res.exome.alleleCount || 0) + (res.genome.alleleCount || 0),
            homCount: (res.exome.homCount || 0) + (res.genome.homCount || 0),
            alleleFreq: ((res.exome.alleleCount || 0) + (res.genome.alleleCount || 0)) /
              ((res.exome.alleleCount || 0) + (res.genome.alleleCount || 0))
          };
        } else {
          res.total = {};
        }
        observer.next(res);
      }, (err) => {
        observer.error(err);
      });
    });
  }

  getDbNSFP(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/dbNSFP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getDECIPHERByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/DECIPHER/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getDECIPHERByGenomLoc(hg19Chr: string, hg19Start: number, hg19Stop: number): Observable<any> {
    const url = `${environment.apiHost}/data/DECIPHER/genomloc/${hg19Chr}/${hg19Start}/${hg19Stop}`;
    return this.http.get(url);
  }

  getDECIPHERDiseaseByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/DECIPHERDisease/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getDECIPHERDiseaseByGenomLoc(hg19Chr: string, hg19Start: number, hg19Stop: number): Observable<any> {
    const url = `${environment.apiHost}/data/DECIPHERDisease/genomloc/${hg19Chr}/${hg19Start}/${hg19Stop}`;
    return this.http.get(url);
  }

  getGeno2MPByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/Geno2MP/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getGeno2MPByGeneEntrezId(entrezId: string | number): Observable<any> {
    const url = `${environment.apiHost}/data/Geno2MP/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getDGVByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/DGV/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getDGVByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/DGV/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getGtexByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/gtex/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getAgrExpByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/expression/orthologs/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getOrthologByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/diopt/ortholog/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getAlignmentByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/diopt/alignment/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getBatchByArray(data): Observable<any> {
    const url = `${environment.apiHost}/data/batch/variants`;
    return this.http.get(url, { params: { variants: data } });
  }

  getGeneBatchByArray(data): Observable<any> {
    const url = `${environment.apiHost}/data/batch/genes`;
    return this.http.get(url, { params: { entrezIds: data.map(d => d.entrezId) } });
  }

  getPharosTargetsByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/pharos/targets/gene/entrezId/${entrezId}`;
    return this.http.get(url);
  }

  getPdbeSummaryByEntrezId(entrezId: number | string): Observable<any> {
    const url = `${environment.apiHost}/data/gene/entrezId/${entrezId}/pdbe/structure`;
    return this.http.get(url);
  }

  getForwardAnnotByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/transvar/forward/gdna/chr${variant.chr}:g.${variant.pos}${variant.ref}%3E${variant.alt}`;
    return this.http.get(url);
  }

  getPrimateByVariant(variant: Variant): Observable<any> {
    const url = `${environment.apiHost}/data/primate/variant/${variant.chr}:${variant.pos}${variant.ref}>${variant.alt}`;
    return this.http.get(url);
  }

  getPrimateByGene(gene: HumanGene): Observable<any> {
    const url = `${environment.apiHost}/data/primate/gene/entrezId/${gene.entrezId}`;
    return this.http.get(url);
  }

  getSmartDomain(gene: HumanGene): Observable<any> {
    return this.http.get(`${environment.apiHost}/data//gene/entrezId/${gene.entrezId}/protein/domain/smart`);
  }

  getPPI(gene: HumanGene): Observable<any> {
    return this.http.get(`${environment.apiHost}/data/ppi/entrezId/${gene.entrezId}`);
  }
}
