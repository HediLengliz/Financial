import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from 'src/app/services/token.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  submitted = false;
  data: any;
  error: any;
  loading = false;

  constructor(private auth:AuthService, private formBuilder:FormBuilder, private router:Router, private toastr: ToastrService, private token:TokenService) { }

  loginForm(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  ngOnInit(): void {
    this.loginForm();
  }

  get f(){
    return this.form.controls;
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.loading = true; // Start loading spinner
    return this.auth.login(this.form.value).subscribe(
      data => this.handleResponse(data),
      error => this.handleError(error)
    );
  }
  
  handleResponse(data: any) {
    if (data.message) {
      this.token.handle(data.access_token);
      this.toastr.success(data.message, 'Success', {
        timeOut: 2000,
        progressBar: true
      });
      this.router.navigateByUrl('/dashboard');
    } else {
      this.handleError("Failed! Email or Password does not match.");
    }
    this.loading = false; // Stop loading spinner
  }

  handleError(error: any) {
    this.toastr.error(error.error.error, 'Error', {
      timeOut: 4000,
      progressBar: true
    });
    this.loading = false; // Stop loading spinner
  }
  
}
