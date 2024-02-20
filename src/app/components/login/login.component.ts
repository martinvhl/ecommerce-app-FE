import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

import myAppConfig from '../../config/my-app-config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  oktaSignIn: any; // OktaSignIn entita, v konstruktoru ji nastavíme

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: 'assets/images/stargate.png',
      /* features: {
        registration: true, // dříve bylo toto nastavení v aplikaci třeba, nyní se přesunulo toto ovládání na Admin panel -> Profile Enrollment atd.
      }, */
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0], // to baseUrl je https://dev-66642739.okta.com
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, // pkce = proof key for code exchange - passing of dynamic secrets
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });
  }
  
  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl(
      {
        el: '#okta-sign-in-widget', // same name as id in div in login.component.html
      },
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
      );
    }
    ngOnDestroy(): void {
      this.oktaSignIn.remove(); // POZOR - bez onDestroy se v případě, že jsme už na login page byly a nepřihlásili se, formulář znovu nezobrazí
    }
  }
