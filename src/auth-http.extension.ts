import { Injectable, FactoryProvider } from '@angular/core';
import { Http, Request } from '@angular/http';
import { AuthHttp, tokenNotExpired } from 'angular2-jwt';
import { AuthService } from './auth.service';
import { AuthConfigExtended } from './auth.config';


export abstract class AuthHttpExtension {

	static getProvider(): FactoryProvider {
		return {
			provide: AuthHttp,
			useFactory: AuthHttpExtension.authHttpFactory,
			deps: [AuthService, AuthConfigExtended, Http],
		};
	}

	private static authHttpFactory(authService: AuthService, authConfig: AuthConfigExtended, http: Http): AuthHttp {
		let authHttp = new AuthHttp(authConfig, http);
		AuthHttpExtension.extend(authService, authHttp);
		return authHttp;
	}

	private static extend(authService: AuthService, authHttp: AuthHttp) {
		let originalFunc = authHttp.requestWithToken;
		(authHttp as any).requestWithToken = (req: Request, token: string) => {
			if (!tokenNotExpired()) {
				authService.checkToken();
			}
			return originalFunc.call(authHttp, req, token);
		};
	}
}
