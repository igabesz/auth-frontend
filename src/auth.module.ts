import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthConfigExtended, IAuthConfigExtended } from './auth.config';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthHttpExtension } from './auth-http.extension';


@NgModule({
	imports: [
		HttpModule,
		RouterModule,
	],
	providers: [
		{
			provide: AuthConfigExtended,
			useValue: new AuthConfigExtended(),
		},
		AuthHttpExtension.getProvider(),
		AuthService,
		AuthGuard,
	],
	exports: [
	]
})
export class AuthModule {

	static forRoot(config?: Partial<IAuthConfigExtended>): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				{
					provide: AuthConfigExtended,
					useValue: new AuthConfigExtended(config),
				},
			],
		};
	}
}
