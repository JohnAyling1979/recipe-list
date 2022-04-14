import { Action } from "@ngrx/store";
import { Recipe } from "../recipes.model";

export const SET_RECIPES = '[Recipes] SET_RECIPES';
export const FETCH_RECIPES = '[Recipes] FETCH_RECIPES';
export const STORE_RECIPES = '[Recipes] STORE_RECIPES';
export const ADD_RECIPES = '[Recipes] ADD_RECIPES';
export const UPDATE_RECIPES = '[Recipes] UPDATE_RECIPES';
export const DELETE_RECIPES = '[Recipes] DELETE_RECIPES';

export class SetRecipes implements Action {
	readonly type = SET_RECIPES;

	constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
	readonly type = FETCH_RECIPES;
}

export class StoreRecipes implements Action {
	readonly type = STORE_RECIPES;
}

export class AddRecipes implements Action {
	readonly type = ADD_RECIPES;

	constructor(public payload: Recipe) {}
}

export class UpdateRecipes implements Action {
	readonly type = UPDATE_RECIPES;

	constructor(public payload: { index: number, recipe: Recipe}) {}
}
export class DeleteRecipes implements Action {
	readonly type = DELETE_RECIPES;

	constructor(public payload: number) {}
}

export type RecipeActions = 
	| SetRecipes
	| FetchRecipes
	| StoreRecipes
	| AddRecipes
	| UpdateRecipes
	| DeleteRecipes
	;