import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-pdbe',
  templateUrl: './pdbe.component.html',
  styleUrls: ['./pdbe.component.scss']
})
export class PdbeComponent implements OnInit {
  @Input() entrezId;
  loading = true;
  data;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getPdbeSummaryByEntrezId(this.entrezId)
      .subscribe((res) => {
        this.loading = false;
        this.data = res;
      }, (err) => {
        this.loading = false;
        this.data = null;
      });
  }

}
