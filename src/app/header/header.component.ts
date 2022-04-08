import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as AuthAction from '../auth/store/auth.actions';
import { DataStorageService } from '../shared/data-storage.service';
import { AppStore } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private userSub: Subscription;
  collapsed = true;
  isAuthenticated = false;

  constructor(private dateStorageService: DataStorageService, private authService: AuthService,  private store: Store<AppStore>) {}

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(map(authState => authState.user)).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dateStorageService.storeRecipes();
  }

  onFetchData() {
    this.dateStorageService.fetchRecipes().subscribe();
  }

  logout() {
    this.store.dispatch(new AuthAction.Logout);
  }
}
