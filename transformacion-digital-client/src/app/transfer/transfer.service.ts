import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  API_BASE: string = 'https://testtransformaciondigitalripley.dailydelivery.cl/';
  constructor(private http: HttpClient) { }

  public saveTransfer(data): Observable<any> {
    return this.http.post<any>(this.API_BASE + 'transfers', data);

  }
  public searchTransfer(): Observable<any> {
    return this.http.get<any>(this.API_BASE + 'transfers');

  }
}
