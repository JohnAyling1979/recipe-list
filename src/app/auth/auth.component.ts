import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService, AuthResponseData } from "./auth.service";

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent {
	isLoginMode = true;
	isLoading = false;
	error: string = null;

	constructor(private authService: AuthService, private router: Router) {}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		this.isLoading = true;
		this.error = null;

		let authObs: Observable<AuthResponseData>;

		if (this.isLoginMode) {
			authObs = this.authService.login(form.value.email, form.value.password)
		} else {
			authObs = this.authService.signup(form.value.email, form.value.password)
		}

		authObs.subscribe(
			resData => {
				this.isLoading = false;
				this.router.navigate(['/recipes']);
			},
			errorMessage => {
				this.error = errorMessage;
				this.isLoading = false;
			}
		);

		form.reset();
	}
}