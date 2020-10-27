import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private http: HttpClient) {}

  public getCurrencyAsJson(url: string): Observable<any> {
    return this.http.get<any>(`${url}`);
  }

  public getCurrencyAsXml(url: string): Observable<any> {
    return from(fetch(url).then((response) => response.text()));
  }
}
