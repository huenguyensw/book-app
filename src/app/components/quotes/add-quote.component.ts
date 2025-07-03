import { Component } from "@angular/core";
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { QuoteService } from "../../services/quote.service";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-add-quote-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-quote.component.html',
})  

export class AddQuoteForm {
    quoteForm: FormGroup;
    error: string | null = null;

    // Utility function to generate a unique object ID
    private generateValidObjectId(): string {
        const chars = 'abcdef0123456789';
        let result = '';
        for (let i = 0; i < 24; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    constructor(
        private fb: FormBuilder,
        private quoteService: QuoteService,
        private router: Router
    ) {
        this.quoteForm = this.fb.group({
            Id: [this.generateValidObjectId()],
            text: ['', [Validators.required]],
            author: ['', [Validators.required]]
        });
    }
    onSubmit() {
        if (this.quoteForm.valid) {
            const quoteData = this.quoteForm.value;

            this.quoteService.addQuote(quoteData).subscribe({
                next: () => {
                    console.log('Quote added successfully, navigating to /quotes...');
                    this.router.navigateByUrl('/quotes').then(success => {
                        console.log('Navigation success:', success);
                    }).catch(err => {
                        console.error('Navigation error:', err);
                    });
                },
                error: (err) => {
                    console.error('Error adding quote:', err);
                    if (err.error) {
                        console.log('Error body:', err.error);
                    }
                    this.error = 'Failed to add quote';
                }
            });
        }
    }
}
