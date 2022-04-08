import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { map, switchMap } from "rxjs";
import { Recipe } from "../recipes.model";
import * as RecipeActions from "./recipe.actions";

@Injectable()
export class RecipeEffects {
	private apiUrl = 'https://ng-course-recipe-list-4ed47-default-rtdb.firebaseio.com/recipes.json';

	constructor(private actions$: Actions, private http:HttpClient) {}

	@Effect()
	fetchRecipes = this.actions$
		.pipe(
			ofType(RecipeActions.FETCH_RECIPES),
			switchMap(() => this.http.get<Recipe[]>(this.apiUrl)),
			map(recipes => recipes.map(recipe => ({...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}))),
			map(recipes => new RecipeActions.SetRecipes(recipes))
		)
}
