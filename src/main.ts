import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { App } from './app/app';

import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

import {
  PublicClientApplication,
  IPublicClientApplication,
  InteractionType
} from '@azure/msal-browser';

// Replace these with your real values
const CLIENT_ID = '99aed11d-9e80-4e29-ae33-865be6b47df5';
const TENANT_ID = 'b41b72d0-4e9f-4c26-8a69-f949f367c91d';
const AUTHORITY = `https://login.microsoftonline.com/${TENANT_ID}`;
const REDIRECT_URI = 'https://proud-smoke-030953510.2.azurestaticapps.net/';

// Create the MSAL instance
const msalInstance = new PublicClientApplication({
  auth: { clientId: CLIENT_ID, authority: AUTHORITY, redirectUri: REDIRECT_URI }
});

// Factory functions
export function MSALInstanceFactory(): IPublicClientApplication {
  return msalInstance;
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map()
  };
}

// Initialize MSAL instance BEFORE bootstrap
msalInstance.initialize().then(() => {
  console.log('MSAL initialized.');

  bootstrapApplication(App, {
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      importProvidersFrom(MsalModule, FormsModule),
      { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
      { provide: MSAL_GUARD_CONFIG, useFactory: MSALGuardConfigFactory },
      { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: MSALInterceptorConfigFactory },
      MsalService,
      MsalGuard,
      MsalBroadcastService,
      { provide: MsalInterceptor, useClass: MsalInterceptor }
    ]
  }).catch(err => console.error(err));
});
