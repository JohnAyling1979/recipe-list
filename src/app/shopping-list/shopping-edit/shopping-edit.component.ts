import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredients.model';
import { AppStore } from 'src/app/store/app-store';
import * as ShoppingListActions from '../store/shopping-list.actions';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  subscription: Subscription;
  editMode = false;

  constructor(private store: Store<AppStore>) { }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true

        this.slForm.setValue({
          name: stateData.editedIngredient.name,
          amount: stateData.editedIngredient.amount,
        });
      } else {
        this.editMode = false
      }
    });
  }

  onSubmit(form: NgForm) {
    const values = form.value;

    const newIngredient = new Ingredient(values.name, values.amount);

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    form.reset();
  }

  onClear() {
    this.store.dispatch(new ShoppingListActions.StopEdit);
  }

  onDelete(form) {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient);

    form.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit);
  }
}
