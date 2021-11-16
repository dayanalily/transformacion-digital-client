import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  API_BASE: string = 'https://testtransformaciondigitalripley.dailydelivery.cl/';
  API_BANKS: string = 'https://bast.dev/api/banks.php'
  constructor(private http: HttpClient) { }

  public listBanks(): Observable<any> {
    return this.http.get<any>(this.API_BANKS);
  }
 
  public saveAdress(data): Observable<any> {
    return this.http.post<any>(this.API_BASE + 'addressees', data);

  }
  public searchAdress(): Observable<any> {
    return this.http.get<any>(this.API_BASE + 'addressees');

  }
  public searchAdressById(id): Observable<any> {
    return this.http.get<any>(this.API_BASE + 'addressees/' + id);

  }
}
