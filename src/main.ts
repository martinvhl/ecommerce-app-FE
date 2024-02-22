/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

//bere hodnotu environment.production a povolí production mode - redukuje vnitřní loogování, disabluje kontroly souborů a auto-reload, minifikuje skripty a soubory stylů, eliminuje ze souborů dead-code atd.
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
