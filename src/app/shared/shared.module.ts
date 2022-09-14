import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder.directive';

@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceholderDirective,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    AlertComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    PlaceholderDirective,
  ],
})
export class SharedModule {}
