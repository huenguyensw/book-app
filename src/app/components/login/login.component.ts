// login.component.ts
import { Component , ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
    loginForm: FormGroup;
    error: string | null = null;
    showAuthError = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef
    ) {
        this.loginForm = this.fb.group({
            useremail: ['', Validators.required],
            password: ['', Validators.required]
        });

        // clear any existing error message
        this.loginForm.valueChanges.subscribe(() => {
            this.error = null;
            this.showAuthError = false;
        });
    }

 ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.showAuthError = params['authError'] === 'true';
    });
  }

    onSubmit() {
        if (this.loginForm.valid) {
            const { useremail, password } = this.loginForm.value;
            this.authService.login(useremail, password).subscribe({
                next: () => {
                    console.log('Login successful, navigating to /books...');
                    this.router.navigateByUrl('/books').then(success => {
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
        } else {
           this.loginForm.markAllAsTouched();
        }
    }
}