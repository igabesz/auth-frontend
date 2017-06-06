import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AuthConfig, IAuthConfigOptional } from 'angular2-jwt';
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
			provide: AuthConfig,
			useValue: new AuthConfig(),
		},
		AuthHttpExtension.getProvider(),
		AuthService,
		AuthGuard,
	],
	exports: [
	]
})
export class AuthModule {

	static forRoot(config: IAuthConfigOptional): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: [
				{
					provide: AuthConfig,
					useValue: new AuthConfig(config),
				},
			],
		};
	}
}
