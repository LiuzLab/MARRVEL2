import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TAXONIDS, TAXONID_TO_INFO } from '../data/model-organisms';

import { HumanGene } from '../interfaces/gene';

@Injectable({
  providedIn: 'root'
})
export class ModelmatcherService {
  taxonIdToOrder;

  constructor(private http: HttpClient) {
    this.taxonIdToOrder = { 9606: 0 };
    for (let i = 0; i < TAXONIDS.length; ++i) {
      this.taxonIdToOrder[TAXONIDS[i]] = i + 1;
    }
  }

  getScientistsByGeneSymbol(geneSymbol: string): Observable< unknown > {
    return new Observable((obs) => {
      this.http.get(`${environment.mmApiHost}/SearchScientistByGene` + 
        `?symbol=${geneSymbol}&taxonId=9606&iSearch=true`)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            obs.next((res['ScientistMatches'] || [])
              .sort((a, b) => {
                const cmpTaxonId = COMPARE(this.taxonIdToOrder[a.modelOrganism.id],
                  this.taxonIdToOrder[b.modelOrganism.id],
                  -1, 1, null);
                if (cmpTaxonId) {
                  return cmpTaxonId;
                }

                const cmpSym = COMPARE(a.matchingGeneSymbol, b.matchingGeneSymbol, -1, 1, null);
                if (cmpSym) {
                  return cmpSym;
                }

                const cmpTier = COMPARE(a.tier, b.tier, -1, 1, null);
                if (cmpTier) {
                  return cmpTier;
                }

                const cmpNetwork = COMPARE(a.network, b.network, -1, 1, null, 'ModelMatcher');
                if (cmpNetwork) {
                  return cmpNetwork;
                }

                const cmpPi = COMPARE(a.pi, b.pi, -1, 1, 0, 'PRINCIPAL_INVESTIGATOR');
                return cmpPi;
              }).map((e) => {
                e.tier = e.tier === 'TIER1' ? 'Primary' : 'Secondary';
                e.pi = e.pi === 'PRINCIPAL_INVESTIGATOR' ? 'Y' : 'N';
                return e;
              }));
              obs.complete();
          },
          error: (err) => {
            obs.next([]);
            obs.complete();
          }
        });
    });
  }
}

const COMPARE = (a: any, b: any,
  aSmall: number, bSmall: number, abTie: number | null, superiorValue?: any) => {
  if (a === b) {
    return abTie;
  }
  if (superiorValue != null) {
    if (a === superiorValue) {
      return -1;
    }
    if (b === superiorValue) {
      return 1;
    }
  }
  return a < b ? aSmall : bSmall;
}
