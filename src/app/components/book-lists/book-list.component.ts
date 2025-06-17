
import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './book-list.component.html'
})
export class BookListComponent {
    books: any[] = [];
    loading: boolean = true;
    error: string | null = null;

    constructor(private bookService: BookService) {
        this.loadBooks();
    }

    loadBooks() {
        this.loading = true;
        this.error = null;
        this.bookService.getBooks().subscribe({
            next: (data) => {
                this.books = data;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'Failed to load books';
                this.loading = false;
            }
        });
    }

    deleteBook(id: string) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }
        this.bookService.deleteBook(id).subscribe({
            next: () => {
                this.books = this.books.filter(book => book.id !== id);
            },
            error: (err) => {
                this.error = 'Failed to delete book';
            }
        });
    }
}