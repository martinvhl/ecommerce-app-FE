import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css'],
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  storage: Storage = sessionStorage;

  //@Inject(OKTA_AUTH) private oktaAuth: OktaAuth - do injektovaného oktaAuth injektuj nastavení OKTA_AUTH (token atd.)
  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    //Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }
  getUserDetails() {
    if (this.isAuthenticated) {
      //Fetch the logged in user details (name, email, etc)
      this.oktaAuth.getUser().then((res) => {
        this.userFullName = res.given_name as string;
        //do session storage pro použití v dalších komponentech
        this.storage.setItem('userEmail', JSON.stringify(res.email)); // pokud uložíme do session storage data jinak než přes JSON.stringify (př. právě email as string), tak nelze data vyzvednout přes JSON.parse - u stringů to jde napřímo (storage.getItem), ale u uložených objektů by to vedlo k nefunkčnosti
      });
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens associated with current user -> made false async just to prevent errors in console
    this.isAuthenticated = false;
    this.userFullName = '';
    this.storage.removeItem('userEmail');
    this.oktaAuth.signOut();
  }
}
