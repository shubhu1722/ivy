import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { messages } from '../../../utilities/messages';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate, post- check=0, pre-check=0', 
    'Pragma': 'no-cache', 
    'Expires': '0'
  });

  get(templateId: string) {
    return this.http.get(`${environment.api_url}${templateId}`).pipe(catchError(this.handleError));
  }

  getLocal(templateId: string) {
    return this.http.get(templateId).pipe(catchError(this.handleError));
  }

  post(templateId: string, body) {
    return this.http.post(`${environment.api_url}${templateId}`, body, { observe: 'response' }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error Occured: ${error.error.message}`;

    } else {
      // server-side error
      errorMessage = `Error Occured: ${error.message}`;

    }

    /// We are returning a generic error message
    return throwError(messages.genericErrorMessage);
  }
}
