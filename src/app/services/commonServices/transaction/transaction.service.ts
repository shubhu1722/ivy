import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { serviceUrls } from 'src/environments/serviceUrls';
import { messages } from 'src/app/utilities/messages';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  get(microserviceId: string, params: any, isLocalService?: boolean): Observable<any> {
    // console.log({microserviceId, params, isLocalService});
    if (isLocalService) {
      return this.http.get(microserviceId, { headers: this.headers, params }).pipe(catchError(this.handleError));
    } else {

      let url = serviceUrls[microserviceId];
      for (const param in params) {
        if (url && url.includes(`:${param}`)) {
          url = url.replace(`:${param}`, params[param]);
          delete params[param];
        }
      }

      return this.http.get(url, { headers: this.headers, params }).pipe(catchError(this.handleError));
    }
  }

  post(microserviceId: string, postBody: any) {
    return this.http.post(serviceUrls[microserviceId], postBody, { observe: 'response' }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error Occured: ${error.error.message}`;
      console.log(errorMessage);
    } else {
      // server-side error
      errorMessage = `Error Occured: ${error.message}`;
      console.log(errorMessage);
    }

    /// We are returning a generic error message
    return throwError(messages.genericErrorMessage);
  }
}
