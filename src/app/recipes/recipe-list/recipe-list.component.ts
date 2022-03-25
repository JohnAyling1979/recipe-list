import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  subscription: Subscription;

  constructor(private recipeService: RecipeService, private dateStorageService: DataStorageService) {}

  ngOnInit(): void {
      this.subscription = this.recipeService.recipesChanged.subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });

      this.recipes = this.recipeService.getRecipes();

      if (this.recipes.length === 0) {
        this.dateStorageService.fetchRecipes().subscribe();
      }
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
