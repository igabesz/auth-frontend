# ngx-auth-provider


## Install

```bash
npm i ngx-auth-provider
```


## Usage

```typescript
import { Http } from '@angular/http';
import { RouterModule, Route } from '@angular/router';
import { AuthModule, AuthGuard, AuthService } from 'ngx-auth-provider';
// import HomeComponent and others

const routes: Route[] = [{
	path: '/home',
	component: HomeComponent,
	canActivate: [AuthGuard],
}];

@NgModule({
	imports: [
		HttpModule,
		RouterModule.forRoot(routes),
		// You can write `AuthModule` OR if you want more config:
		AuthModule.forRoot({ loginRedirect: '/login-2' }),
	],
	// Declare HomeComponent and others
})
export class AppModule {
	constructor(
		private auth: AuthService,
		http: Http,
	) {
		// Define your own login logic: Get the JWT the way you want it.
		auth.login = async function(username: string, password: string) {
			try {
				let token = await http.post(`https://example.com/get-my-token`, {
					username,
					password,
				})
				.map(response => response.json())
				.map(response => response.token)
				.toPromise();
				// Call this on success
				auth.loginSucceeded(token);
			} catch (err) {
				// Call this on failure
				auth.loginFailed(err);
			}
		};
	}
}
```
