import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';

export class ShoppingListService {
	ingredientsChanged = new Subject<Ingredient[]>();
  private ingredients: Ingredient[] = [];

	getIngredients() {
		return this.ingredients.slice();
	}

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);

		this.ingredientsChanged.next(this.getIngredients());
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);

		this.ingredientsChanged.next(this.getIngredients());
  }
}