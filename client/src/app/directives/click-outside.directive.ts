import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

/* tslint:disable:directive-selector */
@Directive({
  selector: '[clickOutside]'
})
/* tslint:enable:directive-selector */
export class ClickOutsideDirective {

  constructor(private _elementRef: ElementRef) { }

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(null);
    }
  }

}
