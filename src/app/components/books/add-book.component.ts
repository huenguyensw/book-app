import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-book-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-book.component.html',

})
export class AddBookForm {
  bookForm: FormGroup;
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
    private bookService: BookService,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      Id: [this.generateValidObjectId()],
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      publishedDate: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const bookData = this.bookForm.value;

      this.bookService.addBook(bookData).subscribe({
        next: () => {
          console.log('Book added successfully, navigating to /books...');
          this.router.navigateByUrl('/books').then(success => {
            console.log('Navigation success:', success);
          }).catch(err => {
            console.error('Navigation error:', err);
          });
        },
        error: (err) => {
          console.error('Error adding book:', err);
          if (err.error) {
            console.log('Error body:', err.error);
          }
          this.error = 'Failed to add book';
        }
      });
    }
  }
}
