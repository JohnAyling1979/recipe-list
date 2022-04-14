import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs";
import { AppStore } from "src/app/store/app.reducer";
import { Recipe } from "../recipes.model";
import * as RecipeActions from "./recipe.actions";

@Injectable()
export class RecipeEffects {
	private apiUrl = 'https://ng-course-recipe-list-4ed47-default-rtdb.firebaseio.com/recipes.json';

	constructor(private actions$: Actions, private http:HttpClient, private store: Store<AppStore>) {}

	fetchRecipes = createEffect(
		() => this.actions$.pipe(
			ofType(RecipeActions.FETCH_RECIPES),
			switchMap(() => this.http.get<Recipe[]>(this.apiUrl)),
			map(recipes => recipes.map(recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}))),
			map(recipes => new RecipeActions.SetRecipes(recipes))
		)
	);

	storeRecipes = createEffect(
		() => this.actions$.pipe(
			ofType(RecipeActions.STORE_RECIPES),
			withLatestFrom(this.store.select('recipe')),
			switchMap(([_actionData, recipeState]) => this.http.put(this.apiUrl, recipeState.recipes))
		),
		{dispatch:false}
	);
}
