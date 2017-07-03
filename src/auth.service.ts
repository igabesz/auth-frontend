import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute, CanActivate, CanActivateChild } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Subject, BehaviorSubject } from 'rxjs';


@Injectable()
export class AuthService {

	/** Returns the actual login state */
	loggedIn = new BehaviorSubject<boolean>(false);

	/** Errors countered during login */
	loginErrors = new Subject<any>();

	/** Returns a promise that completes immediately if login process is not active, otherwise waits for success or failure */
	nextLoggedIn(): Promise<boolean> {
		if (this.loginPending) {
			return new Promise((resolve, reject) => {
				this.loggedIn.first().subscribe(resolve, reject);
			});
		}
		// TODO: Coherency!!!
		return Promise.resolve(tokenNotExpired());
	}

	/** Shows whether there is an ongoing login process */
	loginPending = false;

	/** Specifies whether the browser shall reload the page on logout/expiration */
	reloadOnLogout = true;

	roles: string[] = [];

	constructor(
		private http: Http,
		private router: Router,
		private activatedRoute: ActivatedRoute,
	) {
		try {
			this.checkToken();
		} catch (err) {
			localStorage.removeItem('token');
		}
	}

	private setLoggedIn(loggedIn: boolean) {
		let prevLoggedIn = this.loggedIn.value;
		this.loggedIn.next(loggedIn);
		// Reload page on logout/expiration
		if (this.reloadOnLogout && prevLoggedIn && !loggedIn) {
			window.location.reload();
		}
	}

	/** Called if an authorized HTTP request is made without valid token */
	checkToken() {
		if (!tokenNotExpired() && this.loggedIn.value) {
			this.setLoggedIn(false);
		}
		if (tokenNotExpired() && !this.loggedIn.value) {
			this.setLoggedIn(true);
		}
	}

	/** Override this function to implement your login logic */
	login: Function = () => { throw new Error('Unimplemented'); };

	/** Call this when login process is started */
	beginLogin() {
		this.loginPending = true;
	}

	/** Call this when login succeeds */
	loginSucceeded(token: string) {
		localStorage.setItem('token', token);
		let jwtHelper = new JwtHelper();
		this.roles = jwtHelper.decodeToken(token).roles || [];
		// Propagate success
		this.loginPending = false;
		this.setLoggedIn(true);
		// Redirect to caller site
		let redirectTo: string = this.activatedRoute.snapshot.params.redirectTo;
		if (redirectTo !== undefined) {
			this.router.navigateByUrl(redirectTo);
		}
		else {
			this.router.navigate(['']);
		}
	}

	/** Call this when login fails */
	loginFailed(err: any) {
		localStorage.removeItem('token');
		this.roles = [];
		this.loginPending = false;
		this.setLoggedIn(false);
		this.loginErrors.next(err);
	}

	logout() {
		localStorage.removeItem('token');
		this.roles = [];
		this.setLoggedIn(false);
	}
}
