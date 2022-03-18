import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent {
	isLoginMode = true;

	constructor(private authService: AuthService) {}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		console.log(form.value);
		if (!form.valid) {
			return;
		}

		if (this.isLoginMode) {

		} else {
			this.authService.signup(form.value.email, form.value.password).subscribe(
				resData => {
					console.log('success', resData);
				},
				error => {
					console.log('error', error);
				}
			);
		}
		form.reset();
	}
}