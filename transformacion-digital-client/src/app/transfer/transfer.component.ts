import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { AdressService } from '../adress/adress.service';
import { TransferService } from './transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {

  listAddress: any = [];
  listAddressSelect: any = [];
  formTransfer: FormGroup;
  listTypeAccount: any = [{ id: "0", name: "Cuenta Corriente" }, { id: "1", name: "Cuenta de Ahorros" }, { id: "2", name: "Cuenta Vista" }]
  constructor(private transferService: TransferService,
    private formBuilder: FormBuilder,
    private adressService: AdressService,
    private router: Router,
    private cp: CurrencyPipe) { }

  ngOnInit(): void {
    this.getAddress();
    this.initForms({});
  }
  getAddress() {
    this.adressService.searchAdress().subscribe(data => {
      this.listAddress = data

    })
  }
  initForms(data) {
    this.formTransfer = this.formBuilder.group({
      searchAdress: [data.searchAdress ? data.searchAdress : '', Validators.required],
      amount: [data.amount ? data.amount : '', Validators.required],
    });
  }

  numberFormat() {

    // let output 
    let input = this.formTransfer.value.amount
    let formatedOutputValue = this.cp.transform(parseInt(input));
    this.formTransfer.controls.amount.setValue(formatedOutputValue);
     console.log("this.formTransfer.value.amount", this.formTransfer.value.amount);

    // console.log("input", input);
    
    // if (input === undefined) return ''
    // input = input.toString().replace(/[^0-9\,]/g, '')
    // if (input !== '') {
    //   input = input.toString().replace(/[,]/, '.')
    //   input = parseFloat(input)
    //   let aux_array = input.toString().split('.')
    //   aux_array[0] = aux_array[0]
    //     .toString()
    //     .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    //    output =
    //     typeof aux_array[1] == 'undefined'
    //       ? aux_array[0]
    //       : aux_array[0] + ',' + aux_array[1]
    //   output = output == '' ? 0 : output
    //   console.log("output", output);
   
    //   return output
    // } else {
    //   return ''
    // }

  }
  numberClean(input) {
    let output
    input = input
      .toString()
      .split('.')
      .join('')
    input = input.toString().replace(/[,]/, '.')
    output = parseFloat(input)
    output = output
      .toString()
      .split('.')
      .join(',')
    return output
  }


  obtenerSearchAdress() {

    if (this.formTransfer.value.searchAdress === '') {
      this.listAddressSelect = [];
    } else {
      this.listAddressSelect = this.listAddress.filter(data => data.name === this.formTransfer.value.searchAdress || data.rut === this.formTransfer.value.searchAdress);
    }
  }

  onChangeBank(idBank) {
    this.formTransfer.controls.bank.setValue(idBank);
  }
  onChangeTypeAccount(idTypeAccount) {
    this.formTransfer.controls.typeAccount.setValue(idTypeAccount)
  }

  toTransfer() {

    if (this.formTransfer.status == 'VALID' && this.listAddressSelect.length > 0) {
      let amount = this.numberClean(this.formTransfer.value.amount);
       amount = this.formTransfer.value.amount.toString()
      

      this.transferService.saveTransfer({ idAddressee: this.listAddressSelect[0].id, amount: amount }).subscribe(data => {
        this.initForms({});
        this.listAddressSelect = [];
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'success',
          title: 'Transferencia realizada con exito'
        })
      })

      this.router.navigate(['historial'])


    } else {
      if (this.listAddressSelect.length < 0) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'info',
          title: 'Los datos del destinatario no debe estar vacio'
        })
      }
    }

  }

}
