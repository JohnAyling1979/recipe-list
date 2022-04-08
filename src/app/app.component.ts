import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from "./auth/store/auth.actions";
import { AppStore } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit { 
  constructor(private store: Store<AppStore>) {}

  ngOnInit(): void {
    this.store.dispatch(new AuthActions.AutoLogin);
  }
}
