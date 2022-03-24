import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipes.model";

@Injectable({providedIn: 'root'})
export class DataStorageService {
	private apiUrl = 'https://ng-course-recipe-list-4ed47-default-rtdb.firebaseio.com/recipes.json';

	constructor(private http: HttpClient, private recipeService: RecipeService) {}

	storeRecipes() {
		const recipes = this.recipeService.getRecipes();

		this.http.put(this.apiUrl, recipes).subscribe();
	}

	fetchRecipes() {
		return this.http.get<Recipe[]>(this.apiUrl).pipe(
			map(recipes => {
				return recipes.map(recipe => {
					return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} 
				});
			}),
			tap(recipes => {
				this.recipeService.setRecipes(recipes);
			})
		);
	}
}