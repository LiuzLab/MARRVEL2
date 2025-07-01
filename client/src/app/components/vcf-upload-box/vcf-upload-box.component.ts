import { ApiService } from './../../services/api.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { Animations } from 'src/app/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vcf-upload-box',
  templateUrl: './vcf-upload-box.component.html',
  styleUrls: ['./vcf-upload-box.component.scss'],
  animations: [ Animations.fadeInOut ]
})
export class VcfUploadBoxComponent implements OnInit {
  selectedInputType  = 'vcf';

  file: File | null = null;
  fileFormGroup: FormGroup;
  fileProgress = 0;
  parsing = false;

  @Output() dataChange: EventEmitter< any > = new EventEmitter();

  constructor(
    fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {
    this.fileFormGroup = fb.group({
      fileDisp: new FormControl('', (c: FormControl) => {
        return c.value ? null : { valid: false };
      })
    });
  }

  ngOnInit() {
  }

  onFileChange(e: FileList) {
    const file: File = e[0];
    if (!file) {
      this.file = null;
      this.fileFormGroup.controls['fileDisp'].setErrors({ valid: false });
      this.fileFormGroup.setValue({ fileDisp: null });
    } else if (file.size > 50000000) {
      this.file = null;
      this.fileFormGroup.controls['fileDisp'].setErrors({ valid: false });
      this.fileFormGroup.setValue({ fileDisp: null });
    } else if (file.name.substr(file.name.length - 4) !== '.vcf') {
      this.file = null;
      this.fileFormGroup.controls['fileDisp'].setErrors({ valid: false });
      this.fileFormGroup.setValue({ fileDisp: null });
    } else {
      this.file = file;
      this.fileFormGroup.controls['fileDisp'].setErrors(null);
      this.fileFormGroup.setValue({ fileDisp: file.name });
    }
  }

  processVCF() {
    this.parsing = true;
    this.fileProgress = 0;

    const fr: FileReader = new FileReader();
    const fileSize = this.file.size - 1;
    const chunkSize = 64 * 1024;
    let offset = 0;
    let lastLine = '';
    const variants = [];
    const readNextChunk = () => {
      fr.readAsText(this.file.slice(offset, offset + chunkSize));
      offset += chunkSize;

      this.fileProgress += chunkSize / fileSize * 100;
    };
    const processLines = (lines: string[]) => {
      for (let i = 0; i < lines.length; ++i) {
        const line = lines[i].trim();
        if (line[0] !== '#') {
          const L = line.split('\t');
          variants.push(L[0] + ':' + L[1] + ' ' + L[3] + '>' + L[4]);
        }
      }
    };
    fr.onload = (e) => {
      const result: string = (e.target as FileReader).result as string;
      const lastNLIdx = result.lastIndexOf('\n');
      if (lastNLIdx === -1) {
        lastLine = lastLine + result;
      } else {
        const lines = result.split(/\r?\n/g);
        lines[0] = lastLine + lines[0];
        processLines(lines.slice(0, lines.length - 1));
        lastLine = lines[lines.length - 1];
      }

      if (offset >= fileSize) {
        if (lastLine.length > 0) {
          processLines([ lastLine ]);
        }
        this.dataChange.emit(variants);
        this.fileProgress = 100;
        this.parsing = false;
      } else {
        readNextChunk();
      }
    };
    readNextChunk();
  }

  onInputTypeChange(e) {
    if (this.selectedInputType === 'gene') {
      this.router.navigate(['']);
    } else if (this.selectedInputType === 'protein') {
      this.router.navigate(['human', 'protein' ]);
    } else if (this.selectedInputType === 'modelgene') {
      this.router.navigate(['model', 'gene' ]);
    } else if (this.selectedInputType === 'multigenes') {
      this.router.navigate(['human', 'batch', 'genes' ]);
    }
  }
}
