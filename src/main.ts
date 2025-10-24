

// import { HttpClientModule } from '@angular/common/http';
// import { importProvidersFrom } from '@angular/core';
// import { bootstrapApplication } from '@angular/platform-browser';
// import { App } from './app/app';
// import { appConfig } from './app/app.config';

// bootstrapApplication(App, {
//   ...appConfig,
//   providers: [
//     importProvidersFrom(HttpClientModule) // ✅ make HttpClient injectable
//   ]
// })
// .catch(err => console.error(err));


import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes'; // your routes file

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    importProvidersFrom(HttpClientModule), // for HttpClient
    provideRouter(routes)                  // ✅ for routing
  ]
})
.catch(err => console.error(err));
