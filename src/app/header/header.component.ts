import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { logout } from '../auth/store/auth.actions';
import { fetchRecipes } from '../recipes/store/recipe.actions';
import { AppState } from '../store/app.reducer';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private storeSub!: Subscription;

  collapsed = true;
  isAuthenticated = false;

  constructor(
    private store: Store<AppState>,
    private dataStorageService: DataStorageService
  ) {}

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
    this.dataStorageService.storeRecipes();
  }

  onLogout() {
    this.store.dispatch(logout());
  }
}
