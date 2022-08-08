import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  private isOpen = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    const hostElement = <HTMLAnchorElement>this.elementRef.nativeElement;
    const dropdownMenu = hostElement.nextElementSibling;

    if (!dropdownMenu) return;

    if (!this.isOpen) {
      this.renderer.addClass(dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(dropdownMenu, 'show');
    }

    this.isOpen = !this.isOpen;
  }
}
