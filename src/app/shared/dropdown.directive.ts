import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  private isOpen = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('document:click', ['$event']) onClick(event: Event) {
    const hostElement = <HTMLAnchorElement>this.elementRef.nativeElement;
    const eventTarget = <Node>event.target;

    const dropdownMenu = hostElement.nextElementSibling;

    if (!dropdownMenu) return;

    if (!hostElement.contains(eventTarget)) {
      this.isOpen = false;
      return this.renderer.removeClass(dropdownMenu, 'show');
    }

    if (!this.isOpen) {
      this.renderer.addClass(dropdownMenu, 'show');
    } else {
      this.renderer.removeClass(dropdownMenu, 'show');
    }

    this.isOpen = !this.isOpen;
  }
}
