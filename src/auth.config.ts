import { AuthConfig, IAuthConfig } from 'angular2-jwt';


export interface IAuthConfigExtended extends IAuthConfig {
	loginRedirect: string;
}

export class AuthConfigExtended extends AuthConfig {
	loginRedirect: string;
	loginRedirectIsAbsolute: boolean;

	constructor(options?: Partial<IAuthConfigExtended>) {
		super(options);
		if (options && options.loginRedirect !== undefined) {
			this.loginRedirect = options.loginRedirect;
			this.loginRedirectIsAbsolute = options.loginRedirect.startsWith('http');
		}
		else {
			this.loginRedirect = '/login';
			this.loginRedirectIsAbsolute = false;
		}
	}
}
