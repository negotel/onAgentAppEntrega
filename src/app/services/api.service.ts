import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  readData(url, params) {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}${url}` + this.queryToUrl(params))
        .subscribe((result: any) => {
          resolve(result);
        }, (error) => {
          reject(error);
        });
    });
  }

  insertData(url, data) {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}${url}`, data)
        .subscribe((result: any) => {
          resolve(result);
        }, (error) => {
          reject(error);
        });
    });
  }

  queryToUrl(params?: any[]) {
    // tslint:disable-next-line:only-arrow-functions
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    return Object.keys(params).map(function (key: any) {
      return key + '=' + params[key];
    }).join('&');
  }
}
