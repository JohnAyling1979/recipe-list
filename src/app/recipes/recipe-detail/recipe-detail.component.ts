import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';
import { AppStore } from 'src/app/store/app.reducer';
import { Recipe } from '../recipes.model';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    private store: Store<AppStore>,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params.id;

      this.store
        .select('recipe')
        .pipe(
          map(recipesState => recipesState.recipes.find((recipe, index) => index === this.id))
        )
        .subscribe(recipe => this.recipe = recipe);
    })
  }

  addIngredientsToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients.slice()));
  }

  onDelete() {
    this.store.dispatch(new RecipesActions.DeleteRecipes(this.id));

    this.router.navigate(['/recipes']);
  }
}
