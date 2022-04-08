import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, Effect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface AuthResponseData {
	idToken: string;
	email: string;
	refreshToken: string;
	expiresIn: string;
	localId: string;
}

const handleAuthentication = (resData) => {
	const expirationDate = new Date((new Date()).getTime() + +resData.expiresIn * 1000);
	const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);

	localStorage.setItem('userData', JSON.stringify(user));

	return new AuthActions.AuthenticateSuccess(user);
};

const handleError = (errorRes) => {
	const errorMap = {
		EMAIL_EXISTS: 'This email exists already',
		EMAIL_NOT_FOUND: 'There is no account with this email',
		INVALID_PASSWORD: 'The password you entered is incorrect'
	}

	const errorMessage = errorMap[errorRes?.error?.error?.message] ? errorMap[errorRes.error.error.message] : 'An unknown error has occurred';

	return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
	private signupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`;
	private signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`;

	constructor(private http: HttpClient, private actions$: Actions, private router: Router, private authService: AuthService) { }

	@Effect()
	authLogin = this.actions$.pipe(
		ofType(AuthActions.LOGIN_START),
		switchMap((authData: AuthActions.LoginStart) => {
			return this.http.post<AuthResponseData>(this.signInUrl, {
				email: authData.payload.email,
				password: authData.payload.password,
				returnSecureToken: true,
			}).pipe(
				tap(resData => { this.authService.setLogoutTimer(+resData.expiresIn * 1000)}),
				map(handleAuthentication),
				catchError(handleError)
			);
		})
	);

	@Effect()
	authSignup = this.actions$.pipe(
		ofType(AuthActions.SIGNUP_START),
		switchMap((signupAction: AuthActions.SignupStart) => {
			return this.http.post<AuthResponseData>(this.signupUrl, {
				email: signupAction.payload.email,
				password: signupAction.payload.password,
				returnSecureToken: true,
			}).pipe(
				tap(resData => { this.authService.setLogoutTimer(+resData.expiresIn * 1000)}),
				map(handleAuthentication),
				catchError(handleError)
			);
		})
	);

	@Effect({ dispatch: false })
	authRedirect = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
		this.router.navigate(['/']);
	}));

	@Effect({ dispatch: false })
	authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT), tap(() => {
		this.authService.clearLogoutTime();
		localStorage.removeItem('userData');
		this.router.navigate(['/auth']);
	}));

	@Effect()
	autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN), map(() => {
		const userData = JSON.parse(localStorage.getItem('userData'));

		if (!userData) {
			return new AuthActions.Empty;
		}

		const loadedUser = new User(
			userData.email,
			userData.id,
			userData._token,
			new Date(userData.tokenExpirationDate)
		)

		if (loadedUser.token) {
			const expirationDuration = loadedUser.tokenExpirationDate.getTime() - new Date().getTime();
			this.authService.setLogoutTimer(expirationDuration);

			return new AuthActions.AuthenticateSuccess(loadedUser);
		}

		return new AuthActions.Empty;
	}));
}