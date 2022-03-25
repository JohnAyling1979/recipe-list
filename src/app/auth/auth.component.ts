import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthService, AuthResponseData } from "./auth.service";

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
	private closeSub: Subscription;
	isLoginMode = true;
	isLoading = false;
//	error: string = null;
	@ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;


	constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

	ngOnDestroy(): void {
		this.closeSub?.unsubscribe();
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		this.isLoading = true;
//		this.error = null;

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
//				this.error = errorMessage;
				this.showErrorAlert(errorMessage);
				this.isLoading = false;
			}
		);

		form.reset();
	}

	onClearError() {
//		this.error = null;
	}

	private showErrorAlert(errorMessage: string) {
		const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
		const hostViewContainerRef = this.alertHost.viewContainerRef;

		hostViewContainerRef.clear();

		const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
		componentRef.instance.message = errorMessage;
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe();
			hostViewContainerRef.clear();
		});
	}
}