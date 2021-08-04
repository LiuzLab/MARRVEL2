import { Component, Input, OnInit } from '@angular/core';
import { PrimateData } from 'src/app/interfaces/data';
import { Variant } from 'src/app/interfaces/variant';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-primate',
  templateUrl: './primate.component.html',
  styleUrls: ['./primate.component.scss']
})
export class PrimateComponent implements OnInit {
  @Input() variant: Variant;

  loading = true;
  data: PrimateData;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getPrimateByVariant(this.variant)
      .subscribe((res: PrimateData) => {
        this.data = res;
        this.loading = false;
      }, (err) => {
        console.log(err);
        this.data = null;
        this.loading = false;
      });
  }

}
