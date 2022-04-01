import { ShoppingListState } from "../shopping-list/store/shopping-list.reducer";

export interface AppStore {
	shoppingList: ShoppingListState;
}
