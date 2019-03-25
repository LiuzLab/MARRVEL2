import { Directive, Input, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appUnit]'
})
export class UnitDirective implements OnInit {
  @Input() count: number;
  @Input() unit: string;
  @Input() plural: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.plural = this.plural || (this.unit + 's');
    this.count = this.count || 0;

    if (this.count >= 2) {
      this.el.nativeElement.innerHTML = `${this.count} ${this.plural}`;
    }
    else {
      this.el.nativeElement.innerHTML = `${this.count} ${this.unit}`;
    }
  }

}
