import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private userService: UserService,
    private userAuthService: UserAuthService,
    private router: Router, // Inject the Router service
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const toggle_btn=document.querySelectorAll('.toggle');
    const main=document.querySelector("main");
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach((field: Element) => {
      field.addEventListener("focus", () => {
        field.classList.add("active");
      });

      field.addEventListener("blur", () => {
        if ((field as HTMLInputElement).value !== "") return;
        field.classList.remove("active");
      });
    });

    toggle_btn.forEach((btn) => {
      btn.addEventListener('click', () => {
        main?.classList.toggle('sign-up-mode');
      });
    });
    }



    register(registrationForm: NgForm) {
      this.userService.registerUser(registrationForm.value).subscribe(
        (response: any) => {
          if (response.body && response.body.access_token) {
            localStorage.setItem('access_token', response.body.access_token);
            localStorage.setItem('firstname', response.body.firstname);
            localStorage.setItem('lastname', response.body.lastname);
            localStorage.setItem('user_email', response.body.email);
        
            if (response.body.roles) {
              localStorage.setItem('roles', JSON.stringify(response.body.roles));
  
              const isAdmin = response.body.roles.some(
                (role: any) => role.name === 'ROLE_ADMIN'
              );
  
              if (isAdmin) {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/user']);
              }
            } else {
              // Handle the case when 'roles' is not defined in the response
              console.log('No roles found in the response');
            }
  
            this.http.post('http://localhost:8084/auth/register', { observe: 'response' }).subscribe((data) => {
              // Handle success, if needed
            });
  
            // Reset the form after a successful login
            registrationForm.resetForm();
          } else {
            // Handle the case when 'access_token' is not defined in the response
            console.log('No access_token found in the response');
            registrationForm.resetForm();
          }
        },
        (error) => {
          // Reset the form after an error
          registrationForm.resetForm();
        }
      );
    }
  

  login(loginForm: NgForm) {
    this.userService.login(loginForm.value).subscribe(
      (response: any) => {
        if (response.body && response.body.access_token) {
          localStorage.setItem('access_token', response.body.access_token);
          localStorage.setItem('firstname', response.body.firstname);
          localStorage.setItem('lastname', response.body.lastname);
          localStorage.setItem('user_email', response.body.email);
      
          if (response.body.roles) {
            localStorage.setItem('roles', JSON.stringify(response.body.roles));

            const isAdmin = response.body.roles.some(
              (role: any) => role.name === 'ROLE_ADMIN'
            );

            if (isAdmin) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            // Handle the case when 'roles' is not defined in the response
            console.log('No roles found in the response');
          }

          this.http.post('http://localhost:8084/auth/login', { observe: 'response' }).subscribe((data) => {
            // Handle success, if needed
          });

          // Reset the form after a successful login
          loginForm.resetForm();
        } else {
          // Handle the case when 'access_token' is not defined in the response
          console.log('No access_token found in the response');
          loginForm.resetForm();
        }
      },
      (error) => {
        // Reset the form after an error
        loginForm.resetForm();
      }
    );
  }
}
