import { Directive, Input, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appUnit]'
})
export class UnitDirective implements OnChanges {
  @Input() count: number;
  @Input() unit: string;
  @Input() plural: string;

  constructor(private el: ElementRef) { }

  ngOnChanges() {
    this.plural = this.plural || (this.unit + 's');
    this.count = this.count || 0;
    if (this.unit === '') {
      this.el.nativeElement = this.count;
    }
    else if (this.count >= 2) {
      this.el.nativeElement.innerHTML = `${this.count} ${this.plural}`;
    }
    else {
      this.el.nativeElement.innerHTML = `${this.count} ${this.unit}`;
    }
  }

}
