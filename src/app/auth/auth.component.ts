import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { AppStore } from "../store/app.reducer";
import * as AuthAction from "./store/auth.actions";

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
	private closeSub: Subscription;
	private storeSub: Subscription;
	isLoginMode = true;
	isLoading = false;
	@ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;


	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private store: Store<AppStore>
	) {}

	ngOnInit(): void {
		this.storeSub = this.store.select('auth').subscribe(authState => {
			this.isLoading = authState.loading;
			
			if (authState.authError) {
				this.showErrorAlert(authState.authError);
			}
		});
	}

	ngOnDestroy(): void {
		this.closeSub?.unsubscribe();
		this.storeSub.unsubscribe();
	}

	onSwitchMode() {
		this.isLoginMode = !this.isLoginMode;
	}

	onSubmit(form: NgForm) {
		if (!form.valid) {
			return;
		}

		if (this.isLoginMode) {
			this.store.dispatch(new AuthAction.LoginStart({email: form.value.email, password: form.value.password}));
		} else {
			this.store.dispatch(new AuthAction.SignupStart({email: form.value.email, password: form.value.password}));
		}

		form.reset();
	}

	private showErrorAlert(errorMessage: string) {
		const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
		const hostViewContainerRef = this.alertHost.viewContainerRef;

		hostViewContainerRef.clear();

		const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
		componentRef.instance.message = errorMessage;
		this.closeSub = componentRef.instance.close.subscribe(() => {
			this.closeSub.unsubscribe();
			this.store.dispatch(new AuthAction.ClearError);
			hostViewContainerRef.clear();
		});
	}
}