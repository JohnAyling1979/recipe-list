import { EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredients.model';

export class ShoppingListService {
	ingredientsChanged = new EventEmitter<Ingredient[]>();
  private ingredients: Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Tomatoes', 10),
  ];

	getIngredients() {
		return this.ingredients.slice();
	}

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);

		this.ingredientsChanged.emit(this.getIngredients());
  }
}