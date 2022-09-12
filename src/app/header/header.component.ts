import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;

  collapsed = true;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onLogout() {
    this.authService.logout();
  }
}
