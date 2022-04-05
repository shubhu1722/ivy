import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgxLoadingSpinnerService } from '@k-adam/ngx-loading-spinner';
import { stopRequest } from '../utilities/constants';
import { EMPTY } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestCancelInterceptor implements HttpInterceptor {
  nextRequest = new BehaviorSubject<boolean>(true);

  constructor(private spinner: NgxLoadingSpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const stopNextRequests = stopRequest.some((el) => {
      return request.url.includes(el);
    });

    if (this.nextRequest.value && stopNextRequests) {
      return next.handle(request).pipe(
        tap((res) => {
          if (res instanceof HttpResponse && !res.body.status) {
            this.nextRequest.next(false);
          }
        })
      );
    }

    if (!this.nextRequest.value) {
      this.spinner.hide();
      this.nextRequest.next(true);
      return EMPTY;
    }

    return next.handle(request);
  }
}
