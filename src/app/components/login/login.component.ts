// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            useremail: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const { useremail, password } = this.loginForm.value;
            this.authService.login(useremail, password).subscribe({
                next: () => {
                    console.log('Login successful, navigating to /books...');
                    this.router.navigateByUrl('/books').then(success => {
                        console.log('Navigation success:', success);
                    }).catch(err => {
                        console.error('Navigation error:', err);
                    });
                },
                error: (err) => {
                    console.error('Login error:', err);
                    if (err.error) {
                        console.log('Error body:', err.error);
                    }
                    this.error = 'Invalid email or password';
                }
            });
        }
    }
}