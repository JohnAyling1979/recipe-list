import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, exhaustMap, Observable, take } from "rxjs";
import { AppStore } from "../store/app.reducer";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
	constructor(private store: Store<AppStore>) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return this.store.select('auth').pipe(
			take(1),
			map(authState => authState.user),
			exhaustMap(user => {
				if (!user) {
					return next.handle(req);
				}

				const modifiedReq = req.clone({
					params: new HttpParams().set('auth', user.token)
				});

				return next.handle(modifiedReq);
			})
		);
	}
}