import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdressService } from './adress.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.scss']
})
export class AdressComponent implements OnInit {
  listBansk: any = [];
  formAdress: FormGroup;
  rutValid: boolean
  listTypeAccount: any = [{ id: "0", name: "Cuenta Corriente" }, { id: "1", name: "Cuenta de Ahorros" }, { id: "2", name: "Cuenta Vista" }]
  constructor(private adressService: AdressService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getBanks()
    this.initForms({});
  }
  initForms(data) {
    this.formAdress = this.formBuilder.group({
      rut: [data.rut ? data.rut : '', Validators.required],
      name: [data.name ? data.name : '', Validators.required],
      email: [data.email ? data.email : '', Validators.email],
      phone: [data.phone ? data.phone : '', Validators.required],
      bank: [data.bank ? data.bank : '', Validators.required],
      typeAccount: [data.typeAccount ? data.typeAccount : '', Validators.required],
      accountNumber: [data.accountNumber ? data.accountNumber : '', Validators.required],
    });
  }
  getBanks() {
    this.adressService.listBanks().subscribe(data => {
      this.listBansk = data.banks;
    })


  }
  runFormatting() {
    
    let run = this.formAdress.value.rut
    if (run === undefined) return ''
    let runAux = run
    runAux = runAux.replace(/[^0-9kK]+/gi, '')
    runAux = runAux.toUpperCase()
    if (runAux.length > 9) {
      runAux = runAux.slice(0, 9)
    }
    if (!/\./.test(runAux)) {
      let formatedRun = ''
      let tur = runAux
        .split('')
        .reverse()
        .join('')
      for (var i = tur.length - 1; i >= 0; i--) {
        if ((i == 3 || i == 6) && tur[i] != '.') {
          formatedRun = tur[i] + '.' + formatedRun
        } else if (i === 0 && tur[i] != '-') {
          formatedRun = tur[i] + '-' + formatedRun
        } else {
          formatedRun = tur[i] + formatedRun
        }
      }
      this.formAdress.controls.rut.setValue(formatedRun
        .split('')
        .reverse()
        .join(''));

      return formatedRun
        .split('')
        .reverse()
        .join('')
    }
  }
  runClean(run) {
    return run
      .toString()
      .replace('-', '')
      .replace(/\./g, '')
      .replace(/\s+/g, '')
  }
  runValidation() {
    let run = this.formAdress.value.rut
    if (run === undefined) return false
    const runFormated = run.replace(/\./g, '')
    let Fn2 = {
      validaRut: function (rutCompleto) {
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto)) return false
        let tmp = rutCompleto.split('-')
        let digv = tmp[1]
        let rut = tmp[0]
        if (digv == 'K') digv = 'k'
        return Fn2.dv(rut) == digv
      },
      dv: function (T) {
        let M = 0,
          S = 1
        for (; T; T = Math.floor(T / 10))
          S = (S + (T % 10) * (9 - (M++ % 6))) % 11
        return S ? S - 1 : 'k'
      }
    }
    this.rutValid = Fn2.validaRut(runFormated)
    return Fn2.validaRut(runFormated)
  }
  onChangeBank(idBank) {
    this.formAdress.controls.bank.setValue(idBank);
  }
  onChangeTypeAccount(idTypeAccount) {
    this.formAdress.controls.typeAccount.setValue(idTypeAccount)
  }

  save() {
    console.log("sssss", this.formAdress.invalid);

    if (this.formAdress.status == 'VALID') {
      let accountNumber = this.formAdress.value.accountNumber.toString()
      let phone = this.formAdress.value.phone.toString()
      this.formAdress.controls.accountNumber.setValue(accountNumber);
      this.formAdress.controls.phone.setValue(phone);
      let runClean = this.runClean(this.formAdress.value.rut)
      this.formAdress.controls.rut.setValue(runClean);
      this.adressService.saveAdress(this.formAdress.value).subscribe(data => {
        this.initForms({});
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
          title: 'Destinatario creado con exito'
        })
      })


    }

  }
}