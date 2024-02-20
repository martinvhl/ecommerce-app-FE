import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { OKTA_AUTH } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import { Observable, from, lastValueFrom } from "rxjs";
import { environment } from "src/environment/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

    constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.handleAccess(req, next));
    }

    //async funkce v JS musí vracet Promise -> z Observablu tedy uděláme Promise
    private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        //do requestů přidáváme access token jen v případě, že směřuje na secured endpoint
        const accessToken = this.oktaAuth.getAccessToken();
        if (environment.securedEndpoints.some(url => request.urlWithParams.includes(url))) {
            const modifiedRequest = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + accessToken // podoba hlavičky je daná, key-value je Authorization: Bearer ${token} (i s mezerou)
                }
            });
            //moderní verze pro toPromise (deprecated): https://stackoverflow.com/questions/67044273/rxjs-topromise-deprecated
            return await lastValueFrom(next.handle(modifiedRequest)); // tady musí být lastValueFrom, jinak error
        }
        return await lastValueFrom(next.handle(request)); // neměníme request, jen to necháme probublat
    }

}