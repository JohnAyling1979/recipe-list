import { ActionReducerMap } from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";
import * as fromRecipe from "../recipes/store/recipe.reducer";

export interface AppStore {
	recipe: fromRecipe.State;
	shoppingList: fromShoppingList.State;
	auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppStore> = {
	recipe: fromRecipe.recipeReducer,
	shoppingList: fromShoppingList.shoppingListReducer,
	auth: fromAuth.authReducer,
}