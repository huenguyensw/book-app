// login.component.ts
import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
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
    returnUrl: string = '/books';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private cd: ChangeDetectorRef
    ) {
        this.loginForm = this.fb.group({
            useremail: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        // clear any existing error message
        this.loginForm.valueChanges.subscribe(() => {
            this.error = null;
            this.showAuthError = false;
        });

        // get the return URL from query params or default to '/books'
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params['returnUrl'] || '/books';
        });
    }

    ngOnInit() {
        console.log('LoginComponent initialized', this.router.url);
        this.route.queryParams.subscribe(params => {
            this.showAuthError = params['authError'] === 'true';
        });
    }

    onSubmit() {

        if (this.loginForm.valid) {
            const { useremail, password } = this.loginForm.value;
            console.log('Attempting to log in with:', useremail, password);
            // validate form email and password
            if (this.loginForm.get('useremail')?.hasError('required')) {
                this.error = 'E-postadress är obligatorisk.';
                return;
            }

            if (this.loginForm.get('useremail')?.hasError('email')) {
                this.error = 'Ogiltig e-postadress.';
                return;
            }

            if (this.loginForm.get('password')?.hasError('required')) {  
                this.error = 'Lösenord är obligatoriskt.';
                return;
            }

            this.authService.login(useremail, password).subscribe({
                next: () => {
                    console.log(`Login successful, navigating to: ${this.returnUrl}`);
                    this.router.navigateByUrl(this.returnUrl).then(success => {
                    }).catch(err => {
                        console.error('Navigation error:', err);
                    });
                },
                error: (err) => {
                    this.zone.run(() => {
                        this.showAuthError = true;
                        console.error('Login error:', err);
                        if (err.status === 401) {
                            this.error = 'Ogiltig e-postadress eller lösenord.';

                            if (this.router.url !== '/login') {
                                this.router.navigate(['/login'], { queryParams: { authError: true } });
                            }
                        } else {
                            this.error = 'Ett fel uppstod. Försök igen senare.';
                        }
                    });
                    this.cd.detectChanges(); // Ensure the view updates with the new error message

                }
            });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }
}