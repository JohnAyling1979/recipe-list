import { ActionReducerMap } from "@ngrx/store";
import * as fromAuth from "../auth/store/auth.reducer";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";

export interface AppStore {
	shoppingList: fromShoppingList.State;
	auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppStore> = {
	shoppingList: fromShoppingList.shoppingListReducer,
	auth: fromAuth.authReducer,
}