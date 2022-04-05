import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NgxLoadingSpinnerService } from '@k-adam/ngx-loading-spinner';
import { stopRequest } from '../utilities/constants';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
    private totalRequests = 0;
    constructor(private spinner: NgxLoadingSpinnerService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const stopNextRequests = stopRequest.some(el => {
        return request.url.includes(el);
      })
        /// start the loader
        if(!request.url.includes("uploadMedia")){
            this.showLoader();
            this.totalRequests++;
        }

        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                if(!request.url.includes("uploadMedia")){
                this.totalRequests--;
                if (this.totalRequests <= 0) {
                    /// Time to finish the loader
                    this.onEnd();
                } else if (stopNextRequests && !event.body.status) {
                  this.totalRequests = 0;
                  this.onEnd;
                }
            }
        }
        },
            (err: any) => {
                this.totalRequests = 0;
                /// Oops error ! End the loader
                this.onEnd();
                // if (this.totalRequests === 0) {
                //     /// Time to finish the loader
                //     this.onEnd();
                // }
            }));
    }


    private onEnd(): void {
        this.spinner.hide();
    }
    private showLoader(): void {
        this.spinner.show();
    }
}
