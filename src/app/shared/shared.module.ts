import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
	declarations: [
		AlertComponent,
		LoadingSpinnerComponent,
		PlaceholderDirective,
		DropdownDirective,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	],
	exports: [
		AlertComponent,
		LoadingSpinnerComponent,
		PlaceholderDirective,
		DropdownDirective,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
	]
})
export class SharedModule {}