import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '../auth/store/auth.actions';
import { fetchRecipes, storeRecipes } from '../recipes/store/recipe.actions';
import { AppState } from '../store/app.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private storeSub!: Subscription;

  collapsed = true;
  isAuthenticated = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authstate => {
      const user = authstate.user;
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  onFetchData() {
    this.store.dispatch(fetchRecipes());
  }

  onSaveData() {
    this.store.dispatch(storeRecipes());
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
