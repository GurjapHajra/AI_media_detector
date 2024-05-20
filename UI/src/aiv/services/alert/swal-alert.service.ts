import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalAlertService {

  constructor() { }

  showIconAlert(
    title: string,
    message: string,
    footer: string,
    icon: 'success' | 'error' | 'warning' | 'info' = 'success',
    backdrop: boolean = false,
    bgColor: string = '#151515'
  ) {
    return Swal.fire({
      title,
      text: message,
      icon,
      footer,
      backdrop,
      background: bgColor
    });
  }

  showAlertSimple(
    message: string,
    backdrop: boolean = false,
    bgColor: string = '#151515') {

    return Swal.fire({
      text: message,
      backdrop,
      background: bgColor
    });
  }
}
