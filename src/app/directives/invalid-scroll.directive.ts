import { Directive, ElementRef, HostListener } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { debounceTime, fromEvent, take } from 'rxjs';

@Directive({ selector: '[appInvalidControlScroll]' })
export class InvalidControlScrollDirective {
  constructor(
    private el: ElementRef,
    private formGroupDir: FormGroupDirective
  ) {}

  @HostListener('ngSubmit')
  onSubmit() {
    if (this.formGroupDir.control.invalid) {
      this.scrollToFirstInvalidField();
    }
  }

  private scrollToFirstInvalidField() {
    const firstInvalidField: HTMLElement =
      this.el.nativeElement.querySelector('form .ng-invalid');
    window.scroll({
      top: this.getTopOffset(firstInvalidField),
      left: 0,
      behavior: 'smooth',
    });
    fromEvent(window, 'scroll')
      .pipe(debounceTime(500), take(1))
      .subscribe(() => {
        firstInvalidField.focus();
        console.log(firstInvalidField);
      });
  }

  getTopOffset(controlElement: HTMLElement): number {
    const labelOffset = 150;
    return (
      controlElement.getBoundingClientRect().top + window.scrollY - labelOffset
    );
  }
}
