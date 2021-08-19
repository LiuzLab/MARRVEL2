import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-filter-input',
  templateUrl: './filter-input.component.html',
  styleUrls: ['./filter-input.component.scss']
})
export class FilterInputComponent implements OnInit {
  @Input() placeholder: string;
  @Input() value: string;
  isFocused = false;
  @Output() keyup: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputBox', { static: true }) inputBox: ElementRef;

  constructor() { }

  ngOnInit() {
    if (this.value && this.value !== '') {
      this.inputBox.nativeElement.value = this.value;
    }
  }

  onKeyup(e) {
    this.keyup.emit(e);
  }

  focusInputBox() {
    this.inputBox.nativeElement.focus();
  }

}
