import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredients.model";
import { Recipe } from "./recipes.model";

export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
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

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);

    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;

    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);

    this.recipesChanged.next(this.getRecipes());
  }
}