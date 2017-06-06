import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	constructor(
		private auth: AuthService,
		private router: Router,
	) {}

	async canActivate(route: ActivatedRouteSnapshot) {
		let loggedIn = await this.auth.nextLoggedIn();
		if (!loggedIn) {
			this.router.navigate(['/login', { redirectTo: route.url }]);
			return false;
		}
		return true;
	}

	async canActivateChild(route: ActivatedRouteSnapshot) {
		let loggedIn = await this.auth.nextLoggedIn();
		if (!loggedIn) {
			this.router.navigate(['/login', { redirectTo: route.url }]);
			return false;
		}
		return true;
	}

}
