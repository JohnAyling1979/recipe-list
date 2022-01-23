import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

export class ShoppingListService {
	ingredientsChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [];

	getIngredients() {
		return this.ingredients.slice();
	}

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);

		this.ingredientsChanged.emit(this.getIngredients());
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);

		this.ingredientsChanged.emit(this.getIngredients());
  }
}