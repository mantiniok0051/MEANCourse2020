import { AbstractControl } from '@angular/forms';
import { Observable, Observer, of } from 'rxjs';


export const MIMETypeValitor = (filePickercontrol: AbstractControl): Promise<{[key:string]:any}> | Observable<{[key:string]:any}> =>{

  if (typeof(filePickercontrol.value) === 'string') {
    return of(null);
  }

  const uploadedFile = filePickercontrol.value as File;
  const fileReader = new FileReader();

  const fRObservable = Observable.create((observer:Observer<{[key:string]:any}>)=>{
    fileReader.addEventListener('loadend', ()=>{
      const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header ='';
      let isValid = false;
      for (let index = 0; index < array.length; index++) {
            header += array[index].toString(16);

      }
      switch (header) {
          case "89504e47":
            isValid = true;
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            isValid = true;
            break;
          default:
            isValid = false; // Or you can use the blob.type as fallback
            break;
      }
      if (isValid == true) {
        observer.next(null);
      }else{
        observer.next({invalidMIMEType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(uploadedFile);
  });
  return fRObservable;
};
