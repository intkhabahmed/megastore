import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.component.html',
  styleUrls: ['./create-new-password.component.css']
})
export class CreateNewPasswordComponent implements OnInit {

  newPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  userId: string;
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // redirect to home if already logged in
    if (this.authenticationService.token) {
      this.router.navigate(['/']);
    }

    this.newPasswordForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%\^&\*]).{8,}$")]],
      confirmPassword: ['', Validators.required]
    });

    // get url params from route parameters
    this.userId = this.route.snapshot.queryParams['id'];
    this.token = this.route.snapshot.queryParams['token'];
  }

  // convenience getter for easy access to form fields
  get f() { return this.newPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.f.newPassword.value !== this.f.confirmPassword.value) {
      this.alertService.error('Passwords do not match');
      return;
    }

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.newPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    var body = {
      userId: this.userId,
      token: this.token,
      password: this.f.newPassword.value
    }
    this.apiService.createNewPassword(body)
      .pipe(first())
      .subscribe(
        data => {
          this.submitted = false
          this.alertService.success('Password updated successfully', true);
          setTimeout(() => {
            this.router.navigate(['/login', { replaceUrl: true }]);
          }, 1500);
        },
        error => {
          this.alertService.error(error);
          this.submitted = false
          this.loading = false;
        });
  }

}
