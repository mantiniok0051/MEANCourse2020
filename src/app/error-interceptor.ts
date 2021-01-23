import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';



export class ErrorInterceptor implements HttpInterceptor{

  intercept(request:HttpRequest<any>, next:HttpHandler){
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse)=>{
        console.log(error);
        return throwError(error);
      })
    );
  }
}
