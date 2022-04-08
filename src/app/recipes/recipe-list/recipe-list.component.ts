import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { AppStore } from 'src/app/store/app.reducer';
import { Recipe } from '../recipes.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];
  subscription: Subscription;

  constructor(private dateStorageService: DataStorageService, private store: Store<AppStore>) { }

  ngOnInit(): void {
    this.subscription = this.store
      .select('recipe')
      .pipe(map(recipeState => recipeState.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });

    if (this.recipes.length === 0) {
      this.dateStorageService.fetchRecipes().subscribe();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
