import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from '../model/country.model';
import { environment } from 'src/environment/environment';
import { map, tap } from 'rxjs/operators';
import { State } from '../model/state.model';


interface GetResponseCountries {
    _embedded: {
        countries: Country[];
    };
}

interface GetResponseStates {
    _embedded: {
        states: State[];
    };
}

@Injectable({
  providedIn: 'root',
})
export class CustomFormService {
    constructor(private httpClient: HttpClient) {}

    getCreditCardMonths(startMonth: number): Observable<number[]> {
        let data: number[] = [];
        //build an array for "Month" dropdown list
        //start at current month and loop until 12
        for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
            data.push(theMonth);
        }
        //return the obserable of the data in array
        return of(data);
    }

    getCreditCardYears(): Observable<number[]> {
        let data: number[] = [];
        //build an array for "Year" dropdown list
        //start at current year and loop for next 10 years
        const startYear: number = new Date().getFullYear();
        const endYear: number = startYear + 10;
        for (let theYear = startYear; theYear <= endYear; theYear++) {
            data.push(theYear);
        }
        //return the obserable of the data in array
        return of(data);
    }

    getCountries(): Observable<Country[]> {
        return this.httpClient.get<GetResponseCountries>(`${environment.countriesUrL}`).pipe(map((response) => response._embedded.countries));
    }

    getStatesByCountry(theCountryCode: string): Observable<State[]> {
        const customUrl = `${environment.statesByCountryCodeUrl}${theCountryCode}`;
        return this.httpClient.get<GetResponseStates>(customUrl).pipe(map((response) => response._embedded.states));
    }
}
