export default { 
    oidc: {
        clientId: '0oaez18glwdVrwKjG5d7', //clientId pro My eCommerce App na autoroizačním serveru OKTA
        issuer: 'https://dev-49334620.okta.com/oauth2/default', // default - jméno implicitního autorizačního serveru (na Admin dashboardu - Security-API)
        redirectUri: 'https://localhost:4200/login/callback',
        endSessionRedirectUri: 'https://localhost:4200/products',
        //postLogoutRedirectUri: 'http://localhost:4200/',/* - stejné nastaveno při vytváření okta auth server integrační aplikace, třeba není potřeba zadávat to tady znovu*/
        scopes: ['openid', 'profile', 'email']
    }
}