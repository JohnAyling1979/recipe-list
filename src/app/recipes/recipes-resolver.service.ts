import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, Observable, of, switchMap, take } from "rxjs";
import { AppStore } from "../store/app.reducer";
import { Recipe } from "./recipes.model";
import * as RecipeActions from "./store/recipe.actions";

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
	constructor(private store: Store<AppStore>, private actions$: Actions) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
		return this.store.select('recipe').pipe(
			take(1),
			map(recipesState => {
				return recipesState.recipes;
			}),
			switchMap(recipes => {
				if (recipes.length > 0) {
					return of(recipes);
				}

				this.store.dispatch(new RecipeActions.FetchRecipes);

				return this.actions$.pipe(
					ofType(RecipeActions.SET_RECIPES),
					take(1)
				);
			})
		);
	}
}
