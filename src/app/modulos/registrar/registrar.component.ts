import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  mensaje: string = ""

  registrarForm = new UntypedFormGroup({
    usuario: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', Validators.required)
  })


  constructor() { }

  ngOnInit(): void {
    this.mensaje = '';
  }

  e_registrar(form: any) {

  }

}
