// edit book form component
// edit-book-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-book-form',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './edit-book.component.html',
})
export class EditBookForm implements OnInit {
    bookForm: FormGroup;
    error: string | null = null;
    bookId: string = '';

    constructor(
        private fb: FormBuilder,
        private bookService: BookService,
        private router: Router
    ) {
        this.bookForm = this.fb.group({
            id: [''], // Assuming you have an 'id' field in your form
            title: ['', Validators.required],
            author: ['', Validators.required],
            genre: ['', Validators.required],
            publishedDate: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Get ID from route parameters safely
        const url = this.router.url;
        this.bookId = url.split('/').pop() || '';

        if (this.bookId) {
            this.bookService.getBookById(this.bookId).subscribe({
                next: (book) => {
                    this.bookForm.patchValue({
                        id: book.id || book._id,
                        title: book.title,
                        author: book.author,
                        genre: book.genre,
                        publishedDate: book.publishedDate?.split('T')[0] || ''
                    });
                },
                error: (err) => {
                    console.error('Error loading book data:', err);
                    this.error = 'Could not load book details';
                }
            });
        }
    }

    onSubmit(): void {
        if (this.bookForm.valid) {
            const bookData = this.bookForm.value;
            bookData.publishedDate = new Date(bookData.publishedDate).toISOString();
            const id = this.bookForm.get('id')?.value;

            this.bookService.updateBook(id, bookData).subscribe({
                next: () => {
                    console.log('Book updated successfully, navigating to /books...');
                    this.router.navigateByUrl('/books');
                },
                error: (err) => {
                    console.error('Error updating book:', err);
                    this.error = 'Failed to update book';
                }
            });
        } else {
            this.error = 'Please fill in all required fields';
        }
    }
}