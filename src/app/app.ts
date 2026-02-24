import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/data-access/auth-service';
import { PlantaLogsService } from './planta-logs/data-access/planta-logs-service';
import { FavoritesService } from './plantas/data-access/favorites-service';
import { PlantaService } from './plantas/data-access/planta-service';
import { UserService } from './user/data-access/user-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _userService = inject(UserService);
  private _plantaService = inject(PlantaService);
  private _favoritesService = inject(FavoritesService);
  private _plantaLogsService = inject(PlantaLogsService);
  private _authSubscription?: { unsubscribe: () => void };

  protected readonly title = signal('solar');

  ngOnInit(): void {
    const { data } = this._authService.onAuthStateChange((event) => {
      if (event !== 'SIGNED_OUT') return;

      this._authService.resetState();
      this._userService.resetState();
      this._plantaService.resetState();
      this._favoritesService.resetState();
      this._plantaLogsService.resetState();

      void this._router.navigateByUrl('/auth/log-in');
    });

    this._authSubscription = data.subscription;
  }

  ngOnDestroy(): void {
    this._authSubscription?.unsubscribe();
  }
}
