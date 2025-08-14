import '@angular/localize/init';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';


bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot()),
    provideCharts(withDefaultRegisterables())
  ]
}).catch((err) => console.error(err));