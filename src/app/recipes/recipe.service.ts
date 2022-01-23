import { EventEmitter } from "@angular/core";
import { Ingredient } from "../shared/ingredients.model";
import { Recipe } from "./recipes.model";

export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      'Tasty Schnitzel',
      'A super-tasty Schnitzel - just awesome!',
      'https://www.daringgourmet.com/wp-content/uploads/2014/03/Schnitzel-1-1.jpg',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Breading', 20),
      ]
    ),
    new Recipe(
      'Big Fat Burger',
      'What else you need to say?',
      'https://wordpress-live.heygrillhey.com/wp-content/uploads/2017/05/Fatty-Burger.png',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Bun', 1),
        new Ingredient('Cheese', 1),
        new Ingredient('Ketchup', 1),
      ]
    ),
  ];

  recipeSelected = new EventEmitter<Recipe>();

  getRecipes() {
    return this.recipes.slice();
  }
}