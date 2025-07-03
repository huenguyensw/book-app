import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-quote-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-quote.component.html',
})

export class EditQuoteForm implements OnInit {
    quoteForm: FormGroup;
    error: string | null = null;
    quoteId: string = '';

    constructor(
        private fb: FormBuilder,
        private quoteService: QuoteService,
        private router: Router
    ) {
        this.quoteForm = this.fb.group({
            Id: [''], 
            text: ['', [Validators.required]],
            author: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        // Get ID from route parameters safely
        const url = this.router.url;
        this.quoteId = url.split('/').pop() || '';

        if (this.quoteId) {
            this.quoteService.getQuoteById(this.quoteId).subscribe({
                next: (quote) => {
                    this.quoteForm.patchValue({
                        Id: quote.id || quote._id,
                        text: quote.text,
                        author: quote.author
                    });
                },
                error: (err) => {
                    console.error('Error loading quote data:', err);
                    this.error = 'Could not load quote details';
                }
            });
        }
    }

    onSubmit(): void {
        if (this.quoteForm.valid) {
            const quoteData = this.quoteForm.value;
            const id = this.quoteId || quoteData.id || quoteData._id;

            this.quoteService.updateQuote(id, quoteData).subscribe({
                next: () => {
                    console.log('Quote updated successfully, navigating to /quotes...');
                    this.router.navigateByUrl('/quotes').then(success => {
                        console.log('Navigation success:', success);
                    }).catch(err => {
                        console.error('Navigation error:', err);
                    });
                },
                error: (err) => {
                    console.error('Error updating quote:', err);
                    if (err.error) {
                        console.log('Error body:', err.error);
                    }
                    this.error = 'Failed to update quote';
                }
            });
        }
        else {
            this.error = 'Please fill in all required fields';
        }
    }
}

