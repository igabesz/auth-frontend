import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, CanActivateChild } from '@angular/router';
import { AuthService } from './auth.service';
import { AuthConfigExtended } from './auth.config';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

	constructor(
		private auth: AuthService,
		private router: Router,
		private authConfig: AuthConfigExtended,
	) {}

	async canActivate(route: ActivatedRouteSnapshot) {
		let loggedIn = await this.auth.nextLoggedIn();
		if (!loggedIn) {
			this.redirectToLogin(route);
			return false;
		}
		return true;
	}

	async canActivateChild(route: ActivatedRouteSnapshot) {
		let loggedIn = await this.auth.nextLoggedIn();
		if (!loggedIn) {
			this.redirectToLogin(route);
			return false;
		}
		return true;
	}

	private redirectToLogin(route: ActivatedRouteSnapshot) {
		let redirectTo = this.authConfig.loginRedirect;
		let isAbsolute = this.authConfig.loginRedirectIsAbsolute;
		if (isAbsolute) {
			let currentLocation = window.location.href;
			window.location.href = redirectTo;
			window.location.href += (redirectTo.indexOf('?') === -1) ? '?' : '&';
			window.location.href += 'redirectTo=' + encodeURIComponent(currentLocation);
		} else {
			this.router.navigate([redirectTo, { redirectTo: route.url }]);
		}

	}

}
